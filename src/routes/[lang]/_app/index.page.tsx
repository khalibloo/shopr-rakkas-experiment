import { Head, PageProps } from "rakkasjs";

import HomeBannerSection from "@/components/HomeBannerSection";
import HomeProductListSection from "@/components/HomeProductListSection";
import HomeSignupSection from "@/components/HomeSignupSection";
import config from "@/config";
import HomeCatalogListSection from "@/components/HomeCatalogListSection";
import HomeSplitBannerSection from "@/components/HomeSplitBannerSection";
import { useTranslation } from "react-i18next";
import VSpacing from "@/components/VSpacing";

const HomePage: React.FC<PageProps> = () => {
  const { t } = useTranslation();
  const homeLayout = config.altConfig.homeLayout;

  return (
    <div>
      <Head title={t("site.title")} meta={[{ name: "description", content: t("site.meta") }]} />
      {homeLayout.map((section, i) => {
        if (section.type === "banner") {
          return <HomeBannerSection key={i} {...section} />;
        } else if (section.type === "split-banner") {
          return <HomeSplitBannerSection key={i} {...section} />;
        } else if (section.type === "product-list") {
          return <HomeProductListSection key={i} {...section} />;
        } else if (section.type === "catalog-list") {
          return <HomeCatalogListSection key={i} {...section} />;
        } else if (section.type === "signup") {
          return <HomeSignupSection key={i} {...section} />;
        } else if (section.type === "vertical-spacing") {
          return <VSpacing key={i} height={section.spacing} />;
        }
      })}
    </div>
  );
};

export default HomePage;
