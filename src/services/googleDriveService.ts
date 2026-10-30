/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface GoogleDriveFile {
  id: string;
  name: string;
  mimeType: string;
  webViewLink?: string;
  createdTime?: string;
  modifiedTime?: string;
  size?: string;
}

export const googleDriveService = {
  // Find or create dedicated application folder in user's Drive
  async getOrCreateAppFolder(token: string): Promise<string> {
    const folderName = 'EDU PLAN AI - Data Pusat SD';

    // Search for existing folder
    const searchUrl = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(
      `name = '${folderName}' and mimeType = 'application/vnd.google-apps.folder' and trashed = false`
    )}&fields=files(id, name)`;

    const res = await fetch(searchUrl, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error?.message || 'Gagal mencari folder di Google Drive');
    }

    const data = await res.json();
    if (data.files && data.files.length > 0) {
      return data.files[0].id;
    }

    // Create new folder
    const createRes = await fetch('https://www.googleapis.com/drive/v3/files', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: folderName,
        mimeType: 'application/vnd.google-apps.folder',
      }),
    });

    if (!createRes.ok) {
      const err = await createRes.json().catch(() => ({}));
      throw new Error(err.error?.message || 'Gagal membuat folder di Google Drive');
    }

    const newFolder = await createRes.json();
    return newFolder.id;
  },

  // List files inside the app folder
  async listFilesInFolder(token: string, folderId: string): Promise<GoogleDriveFile[]> {
    const q = `'${folderId}' in parents and trashed = false`;
    const url = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(
      q
    )}&fields=files(id, name, mimeType, webViewLink, createdTime, modifiedTime, size)&orderBy=modifiedTime desc`;

    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error?.message || 'Gagal memuat daftar file dari Google Drive');
    }

    const data = await res.json();
    return data.files || [];
  },

  // Upload JSON backup to Google Drive
  async uploadBackupJson(
    token: string,
    folderId: string,
    backupData: Record<string, unknown>,
    filename: string
  ): Promise<GoogleDriveFile> {
    const fileContent = JSON.stringify(backupData, null, 2);
    const metadata = {
      name: filename,
      mimeType: 'application/json',
      parents: [folderId],
    };

    const boundary = 'foo_bar_baz';
    const delimiter = `\r\n--${boundary}\r\n`;
    const closeDelimiter = `\r\n--${boundary}--`;

    const multipartRequestBody =
      delimiter +
      'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
      JSON.stringify(metadata) +
      delimiter +
      'Content-Type: application/json\r\n\r\n' +
      fileContent +
      closeDelimiter;

    const res = await fetch(
      'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,mimeType,webViewLink,createdTime',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': `multipart/related; boundary=${boundary}`,
        },
        body: multipartRequestBody,
      }
    );

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error?.message || 'Gagal mengunggah file cadangan ke Google Drive');
    }

    return await res.json();
  },

  // Delete file from Google Drive (Mandatory user confirmation handled by calling UI)
  async deleteFile(token: string, fileId: string): Promise<void> {
    const res = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok && res.status !== 204) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error?.message || 'Gagal menghapus file dari Google Drive');
    }
  },
};
