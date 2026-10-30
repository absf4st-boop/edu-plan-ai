import React, { useState } from 'react';
import { Layers, Copy, Plus, Trash2, CheckCircle2, Save, Sparkles, FileText } from 'lucide-react';
import { DocumentTemplate } from '../../types';
import { storageService } from '../../services/storage';

export const TemplateManagerView: React.FC = () => {
  const [templates, setTemplates] = useState<DocumentTemplate[]>(() => storageService.getTemplates());
  const [selectedTemplate, setSelectedTemplate] = useState<DocumentTemplate>(templates[0]);
  const [isEditing, setIsEditing] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleDuplicate = (tpl: DocumentTemplate) => {
    const copy: DocumentTemplate = {
      ...tpl,
      id: `tpl-${Date.now()}`,
      nama: `${tpl.nama} (Salinan Mandiri)`,
      isDefault: false,
    };
    storageService.saveTemplate(copy);
    const updated = storageService.getTemplates();
    setTemplates(updated);
    setSelectedTemplate(copy);
  };

  const handleAddSection = () => {
    const nextId = `sec-${Date.now()}`;
    const updated = {
      ...selectedTemplate,
      sections: [
        ...selectedTemplate.sections,
        { id: nextId, title: 'Bagian Tambahan Baru', required: false },
      ],
    };
    setSelectedTemplate(updated);
  };

  const handleRemoveSection = (secId: string) => {
    const updated = {
      ...selectedTemplate,
      sections: selectedTemplate.sections.filter((s) => s.id !== secId),
    };
    setSelectedTemplate(updated);
  };

  const handleSaveTemplate = () => {
    storageService.saveTemplate(selectedTemplate);
    setTemplates(storageService.getTemplates());
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-cyan-50 text-cyan-600">
              <Layers className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-slate-900">Manajer Template Dokumen Pembelajaran</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Sesuaikan struktur komponen Modul Ajar, RPP ringkas, PROTA, PROMES, ATP, dan format jurnal sekolah Anda.
          </p>
        </div>

        <button
          type="button"
          onClick={() => handleDuplicate(selectedTemplate)}
          className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold shadow flex items-center gap-1.5 cursor-pointer"
        >
          <Copy className="w-4 h-4" /> Duplikat Template Aktif
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Template List Selector */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Katalog Template</h3>
          <div className="space-y-2">
            {templates.map((tpl) => (
              <div
                key={tpl.id}
                onClick={() => setSelectedTemplate(tpl)}
                className={`p-4 rounded-2xl border text-left cursor-pointer transition-all ${
                  selectedTemplate.id === tpl.id
                    ? 'border-blue-600 bg-blue-50/60 shadow-sm'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs text-slate-900">{tpl.nama}</span>
                  {tpl.isDefault && (
                    <span className="text-[10px] bg-slate-100 text-slate-600 font-bold px-1.5 py-0.5 rounded">
                      Baku
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 line-clamp-2">{tpl.deskripsi}</p>
                <span className="text-[10px] text-blue-600 font-semibold block mt-2">
                  {tpl.sections.length} Komponen Struktur
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Template Detail & Sections Editor */}
        <div className="md:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b pb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">{selectedTemplate.nama}</h3>
              <p className="text-xs text-slate-500 mt-0.5">{selectedTemplate.deskripsi}</p>
            </div>
            <button
              type="button"
              onClick={handleSaveTemplate}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{saveSuccess ? 'Tersimpan!' : 'Simpan Template'}</span>
            </button>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Template</label>
              <input
                type="text"
                value={selectedTemplate.nama}
                onChange={(e) => setSelectedTemplate({ ...selectedTemplate, nama: e.target.value })}
                className="w-full text-xs p-2.5 border border-slate-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Deskripsi Penggunaan</label>
              <input
                type="text"
                value={selectedTemplate.deskripsi}
                onChange={(e) => setSelectedTemplate({ ...selectedTemplate, deskripsi: e.target.value })}
                className="w-full text-xs p-2.5 border border-slate-300 rounded-lg"
              />
            </div>
          </div>

          {/* Sections List */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Struktur Komponen & Bab Template
              </h4>
              <button
                type="button"
                onClick={handleAddSection}
                className="px-2.5 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Tambah Komponen
              </button>
            </div>

            <div className="space-y-2">
              {selectedTemplate.sections.map((sec, idx) => (
                <div
                  key={sec.id}
                  className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-3 text-xs"
                >
                  <span className="font-bold text-slate-400 w-6">{idx + 1}.</span>
                  <input
                    type="text"
                    value={sec.title}
                    onChange={(e) => {
                      const val = e.target.value;
                      const copy = [...selectedTemplate.sections];
                      copy[idx] = { ...copy[idx], title: val };
                      setSelectedTemplate({ ...selectedTemplate, sections: copy });
                    }}
                    className="flex-1 p-1.5 bg-white border border-slate-300 rounded-lg font-medium text-slate-800"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveSection(sec.id)}
                    className="p-1 text-slate-400 hover:text-red-600 rounded transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
