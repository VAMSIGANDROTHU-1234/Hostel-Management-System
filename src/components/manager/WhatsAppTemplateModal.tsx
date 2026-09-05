import React, { useState, useEffect } from 'react';
import { WhatsAppTemplate } from '../../types';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useData } from '../../context/DataContext';
import { MessageSquare, Save, Sparkles, CheckCircle2 } from 'lucide-react';

interface WhatsAppTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  template: WhatsAppTemplate | null;
}

export const WhatsAppTemplateModal: React.FC<WhatsAppTemplateModalProps> = ({
  isOpen,
  onClose,
  template,
}) => {
  const { updateWhatsAppTemplate } = useData();
  const [templateBody, setTemplateBody] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (template) {
      setTemplateBody(template.template_body);
    }
  }, [template, isOpen]);

  if (!template) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateWhatsAppTemplate(template.id, templateBody);
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 1500);
  };

  const insertPlaceholder = (placeholder: string) => {
    setTemplateBody(prev => `${prev} ${placeholder}`);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Edit Template - ${template.name}`}
      description="Customize message body text and dynamic placeholders."
      maxWidth="lg"
    >
      <form onSubmit={handleSave} className="space-y-4">
        {/* Placeholder chips */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-red-500" /> Insert Available Variable Placeholders:
          </label>
          <div className="flex flex-wrap gap-1.5 text-xs">
            {['{Tenant Name}', '{Amount}', '{Due Date}', '{Room Number}', '{Bed Number}', '{Late Fee}'].map((ph, idx) => (
              <button
                type="button"
                key={idx}
                onClick={() => insertPlaceholder(ph)}
                className="px-2.5 py-1 rounded-lg bg-red-600/10 text-red-600 dark:text-red-400 border border-red-600/20 font-bold hover:bg-red-600/20 transition-colors"
              >
                + {ph}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
            Message Template Text Body
          </label>
          <textarea
            rows={8}
            value={templateBody}
            onChange={e => setTemplateBody(e.target.value)}
            className="w-full bg-slate-50 dark:bg-charcoal-800/80 border border-slate-200 dark:border-charcoal-700 rounded-xl p-3.5 text-xs font-mono text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-red-600"
            required
          />
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-charcoal-800">
          {isSaved ? (
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> Template Updated!
            </span>
          ) : (
            <span />
          )}

          <div className="flex items-center gap-3">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" leftIcon={<Save className="w-4 h-4" />}>
              Save Template Changes
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
};
