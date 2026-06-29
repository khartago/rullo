import { setRequestLocale } from "next-intl/server";
import { HomeContent } from "@/components/home/HomeContent";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <HomeContent locale={locale} />;
}
