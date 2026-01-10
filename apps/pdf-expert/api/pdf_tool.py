import argparse
import os
from pypdf import PdfWriter, PdfReader
import pdfplumber
import pandas as pd

def merge_pdfs(input_paths, output_path):
    writer = PdfWriter()
    
    for path in input_paths:
        if not os.path.exists(path):
            print(f"Error: File not found: {path}")
            return
            
        try:
            reader = PdfReader(path)
            for page in reader.pages:
                writer.add_page(page)
        except Exception as e:
            print(f"Error reading {path}: {e}")
            return

    try:
        with open(output_path, "wb") as f:
            writer.write(f)
        print(f"Successfully merged {len(input_paths)} files into {output_path}")
    except Exception as e:
        print(f"Error writing output: {e}")

def extract_content(input_path, output_path):
    if not os.path.exists(input_path):
        print(f"Error: File not found: {input_path}")
        return

    markdown_content = []
    
    try:
        with pdfplumber.open(input_path) as pdf:
            for i, page in enumerate(pdf.pages):
                page_num = i + 1
                markdown_content.append(f"## Page {page_num}\n")
                
                # Extract text
                text = page.extract_text()
                if text:
                    markdown_content.append(text)
                    markdown_content.append("\n")
                
                # Extract tables
                tables = page.extract_tables()
                if tables:
                    for j, table in enumerate(tables):
                        if table:
                            # Handle cases where table headers might be empty or None
                            if len(table) > 0:
                                # Use first row as header if available, otherwise just print data
                                headers = table[0]
                                data = table[1:] if len(table) > 1 else []
                                
                                # Clean headers to ensure they are strings
                                headers = [str(h) if h is not None else "" for h in headers]
                                
                                if data:
                                    df = pd.DataFrame(data, columns=headers)
                                    markdown_content.append(f"### Table {j+1}\n")
                                    try:
                                        markdown_content.append(df.to_markdown(index=False))
                                    except ImportError:
                                        # Fallback if tabulate is missing, though we added it to reqs
                                        markdown_content.append(df.to_string(index=False))
                                    markdown_content.append("\n")
                
                markdown_content.append("---\n")
                
        with open(output_path, "w", encoding="utf-8") as f:
            f.write("\n".join(markdown_content))
            
        print(f"Successfully extracted content to {output_path}")
        
    except Exception as e:
        print(f"Error extracting content: {e}")

def get_form_fields(input_path):
    if not os.path.exists(input_path):
        print(f"Error: File not found: {input_path}")
        return None
    
    try:
        reader = PdfReader(input_path)
        fields = reader.get_fields()
        if not fields:
            return {}
            
        result = {}
        for field_name, field_data in fields.items():
            # Handle IndirectObject
            field_type = field_data.get('/FT')
            if hasattr(field_type, 'get_object'):
                 field_type = field_type.get_object()
                 
            current_value = field_data.get('/V', '')
            if hasattr(current_value, 'get_object'):
                current_value = current_value.get_object()
                
            # Extract label (TU - Alternative Name/Tooltip)
            label = field_data.get('/TU')
            if hasattr(label, 'get_object'):
                label = label.get_object()
            
            if not label:
                # Fallback to partial name (T)
                label = field_data.get('/T')
                if hasattr(label, 'get_object'):
                    label = label.get_object()

            result[field_name] = {
                'type': str(field_type) if field_type else None,
                'value': str(current_value) if current_value else '',
                'label': str(label) if label else field_name
            }
        return result
    except Exception as e:
        print(f"Error getting form fields: {e}")
        return None

def fill_form(input_path, field_values, output_path):
    if not os.path.exists(input_path):
        print(f"Error: File not found: {input_path}")
        return False
        
    try:
        reader = PdfReader(input_path)
        writer = PdfWriter()
        
        writer.append(reader)
        
        for page in writer.pages:
            writer.update_page_form_field_values(page, field_values)
            
        with open(output_path, "wb") as f:
            writer.write(f)
        print(f"Successfully filled form to {output_path}")
        return True
    except Exception as e:
        print(f"Error filling form: {e}")
        return False

def main():
    parser = argparse.ArgumentParser(description="PDF Manipulation Tool")
    subparsers = parser.add_subparsers(dest="command", help="Command to execute")
    
    # Merge command
    merge_parser = subparsers.add_parser("merge", help="Merge multiple PDFs")
    merge_parser.add_argument("inputs", nargs="+", help="Input PDF files")
    merge_parser.add_argument("-o", "--output", default="merged.pdf", help="Output PDF file")
    
    # Extract command
    extract_parser = subparsers.add_parser("extract", help="Extract text and tables to Markdown")
    extract_parser.add_argument("input", help="Input PDF file")
    extract_parser.add_argument("-o", "--output", default="output.md", help="Output Markdown file")
    
    args = parser.parse_args()
    
    if args.command == "merge":
        merge_pdfs(args.inputs, args.output)
    elif args.command == "extract":
        extract_content(args.input, args.output)
    else:
        parser.print_help()

if __name__ == "__main__":
    main()
