import React, { useState } from "react";
import { DoctorProfile } from "../types";
import { X, Upload, User, Award, Building2, Stethoscope, Mail, Phone, Check } from "lucide-react";

interface DoctorProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: DoctorProfile;
  onSave: (updatedProfile: DoctorProfile) => void;
}

export const DoctorProfileModal: React.FC<DoctorProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSave,
}) => {
  const [formData, setFormData] = useState<DoctorProfile>({ ...profile });
  const [previewUrl, setPreviewUrl] = useState<string>(profile.photoUrl);

  if (!isOpen) return null;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreviewUrl(result);
        setFormData((prev) => ({ ...prev, photoUrl: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const presetAvatars = [
    "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400",
    "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400",
    "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=400",
    "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=400",
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Stethoscope className="w-6 h-6 text-blue-200" /> Doctor Profile & Designation Settings
            </h2>
            <p className="text-blue-100 text-xs mt-1">
              Customize doctor details, designation, department and photo for top-right header display
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-blue-100 hover:text-white hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Photo Selection Area */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Doctor Photo / Avatar
            </label>
            <div className="flex items-center gap-5">
              <div className="relative group">
                <img
                  src={previewUrl}
                  alt="Doctor avatar"
                  className="w-20 h-20 rounded-full object-cover border-4 border-blue-100 shadow-md"
                />
                <label className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs cursor-pointer transition-opacity">
                  <Upload className="w-5 h-5" />
                </label>
              </div>

              <div className="space-y-2 flex-1">
                <label className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-xs font-medium cursor-pointer transition-colors border border-blue-200">
                  <Upload className="w-4 h-4" />
                  Select Photo from Computer
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
                <p className="text-[11px] text-slate-500">
                  Upload JPG/PNG from your files or pick a preset below:
                </p>

                <div className="flex items-center gap-2 pt-1">
                  {presetAvatars.map((url, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setPreviewUrl(url);
                        setFormData((prev) => ({ ...prev, photoUrl: url }));
                      }}
                      className={`relative w-8 h-8 rounded-full overflow-hidden border-2 ${
                        previewUrl === url ? "border-blue-600 scale-105" : "border-slate-200 opacity-70 hover:opacity-100"
                      }`}
                    >
                      <img src={url} alt="preset" className="w-full h-full object-cover" />
                      {previewUrl === url && (
                        <span className="absolute inset-0 bg-blue-600/30 flex items-center justify-center text-white">
                          <Check className="w-3 h-3" />
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Form Fields Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-blue-600" /> Doctor Name
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Dr. Rohan Mehta"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <Stethoscope className="w-3.5 h-3.5 text-blue-600" /> Designation / Specialty
              </label>
              <input
                type="text"
                required
                value={formData.designation}
                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                placeholder="e.g. Cardiologist"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-blue-600" /> Department
              </label>
              <input
                type="text"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                placeholder="e.g. Cardiology Department"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-blue-600" /> Hospital / Clinic Name
              </label>
              <input
                type="text"
                value={formData.hospital}
                onChange={(e) => setFormData({ ...formData, hospital: e.target.value })}
                placeholder="e.g. CityCare Multi-Speciality Hospital"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-blue-600" /> Qualifications
              </label>
              <input
                type="text"
                value={formData.qualification}
                onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                placeholder="e.g. MD, FACC, DM (Cardiology)"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-blue-600" /> Medical License No.
              </label>
              <input
                type="text"
                value={formData.licenseNumber}
                onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                placeholder="e.g. MCI-847291"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-blue-600" /> Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="rohan.mehta@citycare.org"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-blue-600" /> Contact Phone
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+91 98765 43210"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-md shadow-blue-500/20 transition-all flex items-center gap-2"
            >
              <Check className="w-4 h-4" /> Save Profile Details
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
