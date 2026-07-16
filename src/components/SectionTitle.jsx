export default function SectionTitle({ children, align = 'center', light = false }) {
  const alignment = align === 'left' ? 'text-left' : 'text-center'
  const lineAlign = align === 'left' ? 'mr-auto' : 'mx-auto'

  return (
    <div className={`mb-12 ${alignment}`}>
      <h2 className={`inline-block font-serif text-[2.5rem] font-semibold ${light ? 'text-white' : 'text-primary'}`}>
        {children}
        <span className={`block h-[3px] w-16 ${light ? 'bg-white/50' : 'bg-accent'} ${lineAlign} mt-3`} />
      </h2>
    </div>
  )
}
