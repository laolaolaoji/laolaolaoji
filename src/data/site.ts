export interface SocialLink {
  label: string;
  href: string;
  index: string;
}

export const site = {
  title: "LTX — Full-stack developer & creator",
  description:
    "LTX is a full-stack developer, Linux lover, web designer, and creator.",
  eyebrow: "LTX / DEV",
  heading: "Hello, I’m LTX.",
  roles: [
    "Full-stack developer",
    "Linux lover",
    "Web designer",
    "Creator",
  ],
  socials: [
    {
      index: "01",
      label: "GitHub",
      href: "https://github.com/laolaolaoji",
    },
    {
      index: "02",
      label: "Reddit",
      href: "https://www.reddit.com/user/fasting_sleep",
    },
  ] satisfies SocialLink[],
  registration: {
    label: "鄂ICP备17028589号-4",
    href: "https://beian.miit.gov.cn/",
  },
} as const;
