import React, { useState } from 'react';
import { X, Upload, FileText, CheckCircle, HelpCircle, Shield, AlertCircle } from 'lucide-react';
import { PrescriptionData } from '../types/optical';
import { savePrescription } from '../services/supabaseService';

interface PrescriptionUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSavePrescription: (rx: PrescriptionData) => void;
}

export const PrescriptionUploadModal: React.FC<PrescriptionUploadModalProps> = ({
  isOpen,
  onClose,
  onSavePrescription,
}) => {
  const [tab, setTab] = useState<'upload' | 'manual'>('upload');
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Manual inputs
  const [rightSph, setRightSph] = useState('-1.50');
  const [rightCyl, setRightCyl] = useState('-0.75');
  const [rightAxis, setRightAxis] = useState('90');
  const [rightAdd, setRightAdd] = useState('+1.25');

  const [leftSph, setLeftSph] = useState('-1.75');
  const [leftCyl, setLeftCyl] = useState('-0.50');
  const [leftAxis, setLeftAxis] = useState('85');
  const [leftAdd, setLeftAdd] = useState('+1.25');

  const [pd, setPd] = useState('63');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0].name);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setUploadedFile(e.dataTransfer.files[0].name);
    }
  };

  const handleSave = () => {
    const rx: PrescriptionData = {
      method: tab,
      fileName: uploadedFile || undefined,
      rightEye: {
        sph: rightSph,
        cyl: rightCyl,
        axis: rightAxis,
        add: rightAdd,
      },
      leftEye: {
        sph: leftSph,
        cyl: leftCyl,
        axis: leftAxis,
        add: leftAdd,
      },
      pd: pd,
      notes: notes,
    };
    savePrescription({
      patientName: 'Rx Patient',
      data: rx,
    }).catch(err => console.warn('Rx save error:', err));

    onSavePrescription(rx);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-[#121217] text-white p-5 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#e01a76] uppercase tracking-wider">
              <Shield className="w-3.5 h-3.5" />
              <span>Certified Lens Surfacing</span>
            </div>
            <h2 className="text-xl font-bold font-display text-white mt-0.5">
              Optical Prescription (Rx)
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50">
          <button
            onClick={() => setTab('upload')}
            className={`flex-1 py-3 text-xs font-semibold flex items-center justify-center gap-2 border-b-2 transition-all ${
              tab === 'upload'
                ? 'border-[#e01a76] text-[#e01a76] bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Slip / Photo</span>
          </button>
          <button
            onClick={() => setTab('manual')}
            className={`flex-1 py-3 text-xs font-semibold flex items-center justify-center gap-2 border-b-2 transition-all ${
              tab === 'manual'
                ? 'border-[#e01a76] text-[#e01a76] bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Enter Powers Manually</span>
          </button>
        </div>

        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {tab === 'upload' ? (
            <div className="space-y-4">
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all ${
                  isDragging ? 'border-[#e01a76] bg-pink-50/50' : 'border-slate-300 hover:border-slate-400 bg-slate-50'
                }`}
              >
                <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center mx-auto mb-3 text-[#e01a76]">
                  <Upload className="w-6 h-6" />
                </div>
                <p className="text-xs font-semibold text-slate-800 mb-1">
                  Drag and drop your doctor&apos;s Rx slip here
                </p>
                <p className="text-[11px] text-slate-400 mb-4">
                  Supports JPG, PNG, or PDF formats up to 10MB
                </p>

                <label className="cursor-pointer inline-flex items-center px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium rounded-xl transition-colors shadow-sm">
                  <span>Browse From Device</span>
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.pdf"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {uploadedFile && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="text-xs font-medium text-emerald-900 truncate max-w-[240px]">
                      {uploadedFile}
                    </span>
                  </div>
                  <button
                    onClick={() => setUploadedFile(null)}
                    className="text-xs text-emerald-700 hover:text-emerald-900 font-semibold"
                  >
                    Change
                  </button>
                </div>
              )}

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-[#e01a76] shrink-0 mt-0.5" />
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Our certified opticians verify every prescription value and pupil distance before grinding lenses. If anything is unclear, we reach out via WhatsApp immediately.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Right Eye */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <span className="text-xs font-bold text-slate-800 block mb-2">Right Eye (OD)</span>
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div>
                    <span className="text-[10px] text-slate-500 block mb-1">SPH</span>
                    <input
                      type="text"
                      value={rightSph}
                      onChange={(e) => setRightSph(e.target.value)}
                      className="w-full py-1.5 px-1 text-center font-mono text-xs border border-slate-300 rounded-lg bg-white"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block mb-1">CYL</span>
                    <input
                      type="text"
                      value={rightCyl}
                      onChange={(e) => setRightCyl(e.target.value)}
                      className="w-full py-1.5 px-1 text-center font-mono text-xs border border-slate-300 rounded-lg bg-white"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block mb-1">AXIS</span>
                    <input
                      type="text"
                      value={rightAxis}
                      onChange={(e) => setRightAxis(e.target.value)}
                      className="w-full py-1.5 px-1 text-center font-mono text-xs border border-slate-300 rounded-lg bg-white"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block mb-1">ADD</span>
                    <input
                      type="text"
                      value={rightAdd}
                      onChange={(e) => setRightAdd(e.target.value)}
                      className="w-full py-1.5 px-1 text-center font-mono text-xs border border-slate-300 rounded-lg bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Left Eye */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <span className="text-xs font-bold text-slate-800 block mb-2">Left Eye (OS)</span>
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div>
                    <span className="text-[10px] text-slate-500 block mb-1">SPH</span>
                    <input
                      type="text"
                      value={leftSph}
                      onChange={(e) => setLeftSph(e.target.value)}
                      className="w-full py-1.5 px-1 text-center font-mono text-xs border border-slate-300 rounded-lg bg-white"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block mb-1">CYL</span>
                    <input
                      type="text"
                      value={leftCyl}
                      onChange={(e) => setLeftCyl(e.target.value)}
                      className="w-full py-1.5 px-1 text-center font-mono text-xs border border-slate-300 rounded-lg bg-white"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block mb-1">AXIS</span>
                    <input
                      type="text"
                      value={leftAxis}
                      onChange={(e) => setLeftAxis(e.target.value)}
                      className="w-full py-1.5 px-1 text-center font-mono text-xs border border-slate-300 rounded-lg bg-white"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block mb-1">ADD</span>
                    <input
                      type="text"
                      value={leftAdd}
                      onChange={(e) => setLeftAdd(e.target.value)}
                      className="w-full py-1.5 px-1 text-center font-mono text-xs border border-slate-300 rounded-lg bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* PD */}
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <span className="text-xs font-bold text-slate-800 block">Pupillary Distance (PD)</span>
                  <span className="text-[11px] text-slate-400">Average adult PD is between 60mm and 66mm</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    value={pd}
                    onChange={(e) => setPd(e.target.value)}
                    className="w-16 py-1.5 px-2 text-center font-mono text-xs border border-slate-300 rounded-lg bg-white"
                  />
                  <span className="text-xs text-slate-500 font-semibold">mm</span>
                </div>
              </div>
            </div>
          )}

          {/* Save Action */}
          <div className="pt-2">
            <button
              onClick={handleSave}
              className="w-full py-3 px-4 bg-[#e01a76] hover:bg-[#b7005d] text-white font-semibold rounded-xl text-xs transition-colors shadow-md flex items-center justify-center gap-2"
            >
              <span>Attach Prescription To Order</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
