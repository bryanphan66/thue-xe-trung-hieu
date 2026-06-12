import { setRequestLocale } from "next-intl/server";
import { useTranslations } from "next-intl";

// Placeholder tạm để xác minh boot + redirect locale.
// Sẽ thay bằng các section trang chủ (Hero, ServiceTypes, ...) ở giai đoạn sau.
export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <Placeholder />;
}

function Placeholder() {
  const t = useTranslations("hero");
  return (
    <main className="container section">
      <h1 className="display">
        {t("line1")} {t("line2")} {t("line3")}
      </h1>
      <p className="lead" style={{ marginTop: 16 }}>
        {t("lead")}
      </p>
    </main>
  );
}
