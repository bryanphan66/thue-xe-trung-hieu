/**
 * JsonLd — chèn structured data (schema.org) cho SEO.
 * Render server-side, an toàn vì dữ liệu là tĩnh/nội bộ (không phải input người dùng).
 */
export default function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
