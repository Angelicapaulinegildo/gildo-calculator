export default function Button({ label, onClick, variant = 'num', className = '' }) {
  const variants = {
    num: 'bg-white text-herb-ink border-2 border-herb-ink hover:bg-herb-paper shadow-[0_4px_0_#2a3f1f]',
    op: 'bg-spice-cinnamon text-white border-2 border-spice-cinnamonDark hover:bg-spice-cinnamonLight shadow-[0_4px_0_#8b5428]',
    equal: 'bg-herb-jade text-gold border-2 border-herb-jadeDark hover:bg-herb-jade/90 shadow-[0_4px_0_#2d5a3d]',
    clear: 'bg-lavender text-white border-2 border-lavender-dark hover:bg-lavender-light shadow-[0_4px_0_#7c6fa0]',
    func: 'bg-herb-paper text-herb-ink border-2 border-herb-ink hover:bg-white shadow-[0_4px_0_#2a3f1f]',
    sci: 'bg-herb-sage text-herb-ink border-2 border-herb-mossDark hover:bg-herb-sageDark shadow-[0_3px_0_#5a6b45]',
  };

  const sizes = {
    sci: 'text-[10px] md:text-xs py-2',
    default: 'text-base py-3',
  };

  const variantClass = variants[variant] || variants.num;
  const sizeClass = variant === 'sci' ? sizes.sci : sizes.default;

  return (
    <button
      onClick={onClick}
      className={`rounded-full font-bold transition-all duration-150 cursor-pointer select-none active:translate-y-1 active:shadow-none ${variantClass} ${sizeClass} ${className}`}
    >
      {label}
    </button>
  );
}