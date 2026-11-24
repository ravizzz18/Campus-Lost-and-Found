import React, { useRef, useState } from 'react';
import { UploadCloud, X, AlertCircle } from 'lucide-react';

interface ImageUploadProps {
  label?: string;
  helperText?: string;
  onImageChange: (base64Image: string | null) => void;
  maxSizeMB?: number;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  label = 'Photograph of Item (Optional)',
  helperText = 'Upload a clear photograph to speed up identification (JPEG, PNG, WebP up to 5MB).',
  onImageChange,
  maxSizeMB = 5,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFile = (file: File) => {
    setError(null);

    // Validate type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      setError('Please upload an image file (JPEG, PNG, or WebP).');
      return;
    }

    // Validate size
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`Image file size must be smaller than ${maxSizeMB}MB.`);
      return;
    }

    // Read and convert to base64
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setPreview(base64);
      onImageChange(base64);
    };
    reader.onerror = () => {
      setError('Error reading file. Please try another image.');
    };
    reader.readAsDataURL(file);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(null);
    setError(null);
    onImageChange(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
          {label}
        </label>
      )}

      {preview ? (
        <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-50 p-2 max-w-sm">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-44 object-cover rounded-lg"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-4 right-4 bg-navy-900/80 text-white p-1.5 rounded-full hover:bg-rose-600 transition-colors shadow-subtle"
            title="Remove photo"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-300 hover:border-royal-500 hover:bg-royal-50/20 rounded-xl p-6 text-center cursor-pointer transition-colors"
        >
          <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center mx-auto mb-2">
            <UploadCloud className="w-5 h-5 text-royal-600" />
          </div>
          <span className="text-xs sm:text-sm font-semibold text-royal-600 hover:underline">
            Click to upload photograph
          </span>
          <p className="text-[11px] text-slate-400 mt-1">{helperText}</p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={handleChange}
          />
        </div>
      )}

      {error && (
        <div className="flex items-center gap-1.5 text-xs text-rose-600 pt-1">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};
