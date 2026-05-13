export default function SectionHead({ idx, title, code }: { idx: string; title: string; code: string }) {
  return (
    <div className="section-head">
      <span><span className="idx">{idx}</span> · {title}</span>
      <span>{code}</span>
    </div>
  )
}
