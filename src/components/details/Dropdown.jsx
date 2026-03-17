import { useState, useRef, useEffect } from 'react';
import { ChevronDownIcon, CheckIcon } from '@heroicons/react/24/outline';


const Dropdown = ({
  options = [],
  value,
  onChange,
  icon = null,
  heading = null,
  placeholder = 'Select…',
  minWidth = 'min-w-[140px]',
  showIndex = false,
  panelAlign = 'left',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  const selected = options.find((o) => o.value === value);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close on Escape
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    if (isOpen) document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen]);

  return (
    <div className="relative" ref={ref}>
      {/* ── Trigger ── */}
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        className={`flex items-center gap-2 px-3 py-2 bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.08] hover:border-white/[0.16] rounded-lg text-xs font-medium text-white/90 transition-all duration-300 backdrop-blur-md cursor-pointer ${minWidth} group`}
      >
        {icon && <span className="shrink-0">{icon}</span>}
        <span className="flex-1 text-left truncate">
          {selected?.label || placeholder}
        </span>
        <ChevronDownIcon
          className={`w-4 h-4 text-white/40 group-hover:text-white/70 transition-transform duration-300 shrink-0 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* ── Panel ── */}
      {isOpen && (
        <div
          className={`absolute top-full mt-2 w-max min-w-[160px] max-w-[85vw] sm:w-56 bg-zinc-900/95 backdrop-blur-xl border border-white/[0.08] rounded-lg shadow-xl shadow-black/50 z-[100] overflow-hidden animate-in ${panelAlign === 'right' ? 'right-0' : 'left-0'
            }`}
        >
          {/* Heading */}
          {heading && (
            <div className="px-4 py-2.5 border-b border-white/[0.06]">
              <p className="text-[10px] uppercase tracking-wider text-white/30 font-semibold">
                {heading}
              </p>
            </div>
          )}

          {/* Options */}
          <div className="py-1.5 max-h-64 overflow-y-auto scrollbar-hide">
            {options.map((opt, index) => {
              const isSelected = opt.value === value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-all duration-200 cursor-pointer ${isSelected
                    ? 'bg-amber-500/10 text-amber-400'
                    : 'text-white/70 hover:bg-white/[0.06] hover:text-white'
                    }`}
                >
                  {/* Optional index badge */}
                  {showIndex && (
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${isSelected
                        ? 'bg-amber-500/20 text-amber-400'
                        : 'bg-white/[0.06] text-white/40'
                        }`}
                    >
                      {index + 1}
                    </div>
                  )}

                  <span className="flex-1 text-left font-medium">{opt.label}</span>

                  {isSelected && (
                    <CheckIcon className="w-4 h-4 text-amber-400 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
