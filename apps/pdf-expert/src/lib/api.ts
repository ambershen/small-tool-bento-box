import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

export interface UploadedFile {
  original_name: string;
  server_name: string;
}

export const uploadFiles = async (files: File[]): Promise<UploadedFile[]> => {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append('files', file);
  });

  const response = await api.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data.files;
};

export const mergePdfs = async (filenames: string[]): Promise<{ output_filename: string; file_size: number }> => {
  const response = await api.post('/merge', { filenames });
  return response.data;
};

export const convertToMarkdown = async (filename: string): Promise<{ output_filename: string; markdown_content: string }> => {
  const response = await api.post('/convert', { filename });
  return response.data;
};

export const analyzeForm = async (filename: string): Promise<{ fields: Record<string, { type: string; value: string; label: string }> }> => {
  const response = await api.post('/analyze-form', { filename });
  return response.data;
};

export const fillForm = async (filename: string, fields: Record<string, string>): Promise<{ output_filename: string; file_size: number }> => {
  const response = await api.post('/fill-form', { filename, fields });
  return response.data;
};

export const getDownloadUrl = (filename: string, preview: boolean = false) => {
  return `/api/download/${filename}${preview ? '?preview=true' : ''}`;
};
