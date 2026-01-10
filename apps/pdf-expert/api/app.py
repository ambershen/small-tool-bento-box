import os
import time
import uuid
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from werkzeug.utils import secure_filename
import pdf_tool

app = Flask(__name__)
CORS(app)

# Configure upload and processed directories
UPLOAD_FOLDER = '/tmp/uploads'
PROCESSED_FOLDER = '/tmp/processed'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(PROCESSED_FOLDER, exist_ok=True)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['PROCESSED_FOLDER'] = PROCESSED_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 50 * 1024 * 1024  # 50MB limit

def cleanup_old_files():
    """Clean up files older than 1 hour"""
    current_time = time.time()
    for folder in [UPLOAD_FOLDER, PROCESSED_FOLDER]:
        for filename in os.listdir(folder):
            file_path = os.path.join(folder, filename)
            if os.path.isfile(file_path):
                if current_time - os.path.getmtime(file_path) > 3600:
                    try:
                        os.remove(file_path)
                    except Exception as e:
                        print(f"Error deleting {file_path}: {e}")

@app.route('/api/upload', methods=['POST'])
def upload_files():
    cleanup_old_files()
    if 'files' not in request.files:
        return jsonify({'status': False, 'message': 'No files part'}), 400
    
    files = request.files.getlist('files')
    filenames = []
    
    for file in files:
        if file.filename == '':
            continue
        if file and file.filename.lower().endswith('.pdf'):
            filename = secure_filename(file.filename)
            unique_filename = f"{uuid.uuid4()}_{filename}"
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], unique_filename))
            filenames.append({
                'original_name': filename,
                'server_name': unique_filename
            })
    
    if not filenames:
        return jsonify({'status': False, 'message': 'No valid PDF files uploaded'}), 400
        
    return jsonify({'status': True, 'files': filenames, 'message': 'Upload successful'})

@app.route('/api/merge', methods=['POST'])
def merge_pdfs():
    cleanup_old_files()
    data = request.json
    if not data or 'filenames' not in data:
        return jsonify({'status': False, 'message': 'No filenames provided'}), 400
    
    filenames = data['filenames'] # List of server_names
    if not filenames:
        return jsonify({'status': False, 'message': 'Empty file list'}), 400

    input_paths = []
    for fname in filenames:
        path = os.path.join(app.config['UPLOAD_FOLDER'], fname)
        if not os.path.exists(path):
            return jsonify({'status': False, 'message': f'File not found: {fname}'}), 404
        input_paths.append(path)
    
    output_filename = f"merged_{uuid.uuid4()}.pdf"
    output_path = os.path.join(app.config['PROCESSED_FOLDER'], output_filename)
    
    try:
        pdf_tool.merge_pdfs(input_paths, output_path)
        if os.path.exists(output_path):
            file_size = os.path.getsize(output_path)
            return jsonify({
                'status': True, 
                'output_filename': output_filename,
                'file_size': file_size
            })
        else:
            return jsonify({'status': False, 'message': 'Merge failed to create output file'}), 500
    except Exception as e:
        return jsonify({'status': False, 'message': str(e)}), 500

@app.route('/api/convert', methods=['POST'])
def convert_to_markdown():
    cleanup_old_files()
    data = request.json
    if not data or 'filename' not in data:
        return jsonify({'status': False, 'message': 'No filename provided'}), 400
    
    filename = data['filename']
    input_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    
    if not os.path.exists(input_path):
        return jsonify({'status': False, 'message': 'File not found'}), 404
        
    output_filename = f"converted_{uuid.uuid4()}.md"
    output_path = os.path.join(app.config['PROCESSED_FOLDER'], output_filename)
    
    try:
        pdf_tool.extract_content(input_path, output_path)
        if os.path.exists(output_path):
            with open(output_path, 'r', encoding='utf-8') as f:
                content = f.read()
            return jsonify({
                'status': True,
                'output_filename': output_filename,
                'markdown_content': content
            })
        else:
             return jsonify({'status': False, 'message': 'Conversion failed to create output file'}), 500
    except Exception as e:
        return jsonify({'status': False, 'message': str(e)}), 500

@app.route('/api/download/<filename>', methods=['GET'])
def download_file(filename):
    file_path = os.path.join(app.config['PROCESSED_FOLDER'], filename)
    if not os.path.exists(file_path):
        return jsonify({'status': False, 'message': 'File not found'}), 404
    
    # Check if preview mode is requested
    preview = request.args.get('preview', 'false').lower() == 'true'
    
    return send_file(file_path, as_attachment=not preview)

@app.route('/api/analyze-form', methods=['POST'])
def analyze_form():
    cleanup_old_files()
    data = request.json
    if not data or 'filename' not in data:
        return jsonify({'status': False, 'message': 'No filename provided'}), 400
        
    filename = data['filename']
    path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    
    fields = pdf_tool.get_form_fields(path)
    
    if fields is None:
         return jsonify({'status': False, 'message': 'Failed to analyze PDF or no fields found'}), 500
         
    return jsonify({'status': True, 'fields': fields})

@app.route('/api/fill-form', methods=['POST'])
def fill_form_endpoint():
    cleanup_old_files()
    data = request.json
    if not data or 'filename' not in data or 'fields' not in data:
        return jsonify({'status': False, 'message': 'Missing filename or fields'}), 400
        
    filename = data['filename']
    field_values = data['fields']
    
    input_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    output_filename = f"filled_{uuid.uuid4()}.pdf"
    output_path = os.path.join(app.config['PROCESSED_FOLDER'], output_filename)
    
    success = pdf_tool.fill_form(input_path, field_values, output_path)
    
    if success:
        if os.path.exists(output_path):
            file_size = os.path.getsize(output_path)
            return jsonify({
                'status': True, 
                'output_filename': output_filename,
                'file_size': file_size
            })
        else:
            return jsonify({'status': False, 'message': 'Fill failed to create output file'}), 500
    else:
        return jsonify({'status': False, 'message': 'Failed to fill form'}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
