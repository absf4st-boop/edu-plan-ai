import mammoth from 'mammoth';
import * as XLSX from 'xlsx';

export interface ExtractedDocumentData {
  fileName: string;
  fileType: 'docx' | 'xlsx' | 'csv' | 'pdf' | 'unknown';
  fileSize: number;
  rawText: string;
  tableData?: any[][];
  suggestedType?: 'MODUL_AJAR' | 'PROTA' | 'PROMES' | 'ATP' | 'JURNAL' | 'LKPD';
}

export const documentImporter = {
  async importFile(file: File): Promise<ExtractedDocumentData> {
    const fileName = file.name;
    const extension = fileName.split('.').pop()?.toLowerCase() || '';
    const fileSize = file.size;

    if (extension === 'docx') {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      const rawText = result.value || '';
      return {
        fileName,
        fileType: 'docx',
        fileSize,
        rawText,
        suggestedType: this.guessDocumentType(rawText),
      };
    }

    if (extension === 'xlsx' || extension === 'xls' || extension === 'csv') {
      const arrayBuffer = await file.arrayBuffer();
      const wb = XLSX.read(arrayBuffer, { type: 'array' });
      const firstSheetName = wb.SheetNames[0];
      const sheet = wb.Sheets[firstSheetName];
      const tableData: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1 });
      const rawText = tableData.map((row) => row.join('\t')).join('\n');

      return {
        fileName,
        fileType: extension === 'csv' ? 'csv' : 'xlsx',
        fileSize,
        rawText,
        tableData,
        suggestedType: this.guessDocumentType(rawText),
      };
    }

    if (extension === 'pdf') {
      // Basic text read or FileReader
      const text = await file.text().catch(() => '');
      return {
        fileName,
        fileType: 'pdf',
        fileSize,
        rawText: text || 'Dokumen PDF telah dibaca. Silakan periksa ringkasan konten di bawah atau petakan ke template perangkat pembelajaran.',
        suggestedType: 'MODUL_AJAR',
      };
    }

    throw new Error(`Format file .${extension} tidak didukung. Mohon gunakan file .docx, .xlsx, .csv, atau .pdf.`);
  },

  guessDocumentType(text: string): 'MODUL_AJAR' | 'PROTA' | 'PROMES' | 'ATP' | 'JURNAL' | 'LKPD' {
    const lower = text.toLowerCase();
    if (lower.includes('program tahunan') || lower.includes('prota')) return 'PROTA';
    if (lower.includes('program semester') || lower.includes('promes')) return 'PROMES';
    if (lower.includes('alur tujuan') || lower.includes('atp')) return 'ATP';
    if (lower.includes('jurnal harian') || lower.includes('jurnal mengajar')) return 'JURNAL';
    if (lower.includes('lembar kerja') || lower.includes('lkpd')) return 'LKPD';
    return 'MODUL_AJAR';
  },
};
