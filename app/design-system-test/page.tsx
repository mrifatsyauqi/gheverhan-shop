import { Button, Container, Typography } from "@/components/ui";

const grayScale = [
  { shade: 50, className: "bg-gray-50" },
  { shade: 100, className: "bg-gray-100" },
  { shade: 200, className: "bg-gray-200" },
  { shade: 300, className: "bg-gray-300" },
  { shade: 400, className: "bg-gray-400" },
  { shade: 500, className: "bg-gray-500" },
  { shade: 600, className: "bg-gray-600" },
  { shade: 700, className: "bg-gray-700" },
  { shade: 800, className: "bg-gray-800" },
  { shade: 900, className: "bg-gray-900" },
] as const;

export default function DesignSystemTestPage() {
  return (
    <Container className="flex flex-col gap-12 py-16">
      <section className="flex flex-col gap-4">
        <Typography as="h1" variant="heading" className="text-4xl font-semibold text-primary">
          Playfair Display — Heading Font
        </Typography>
        <Typography as="p" variant="body" className="max-w-xl text-base text-primary">
          Inter — Body Font. Paragraf ini memakai token font-body untuk membuktikan Inter ter-load
          dengan benar via next/font dan Tailwind theme token.
        </Typography>
      </section>

      <section className="flex flex-col gap-4">
        <Typography as="h2" variant="heading" className="text-2xl font-semibold text-primary">
          Warna Primary & Background
        </Typography>
        <div className="flex flex-wrap gap-4">
          <div className="flex h-24 w-40 items-center justify-center rounded-lg bg-primary text-background">
            bg-primary
          </div>
          <div className="flex h-24 w-40 items-center justify-center rounded-lg border border-gray-200 bg-background text-primary">
            bg-background
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <Typography as="h2" variant="heading" className="text-2xl font-semibold text-primary">
          Gray Scale (50–900)
        </Typography>
        <div className="flex flex-wrap gap-2">
          {grayScale.map(({ shade, className }) => (
            <div key={shade} className="flex flex-col items-center gap-1">
              <div className={`h-12 w-12 rounded border border-gray-200 ${className}`} />
              <span className="text-xs text-primary">{shade}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <Typography as="h2" variant="heading" className="text-2xl font-semibold text-primary">
          Button Variants
        </Typography>
        <div className="flex flex-wrap gap-4">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
        </div>
      </section>
    </Container>
  );
}
