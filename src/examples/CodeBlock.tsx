type CodeBlockProps = {
  code: string;
  label?: string;
};

const CodeBlock = ({ code, label }: CodeBlockProps) => (
  <div className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-slate-950">
    {label ? (
      <p className="border-b border-white/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
        {label}
      </p>
    ) : null}
    <pre className="overflow-x-auto p-4 text-xs leading-relaxed text-slate-100">
      <code>{code}</code>
    </pre>
  </div>
);

export default CodeBlock;
