import type { ComponentConfig } from "@puckeditor/core";
import { MediaField } from "./media-field";
import { SectionHeading } from "./SectionHeading";
import { SECTION_SUBTITLE_FIELD, SECTION_TITLE_FIELD } from "./shared";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type MemberItem = { avatar: string; name: string; role: string; bio: string };
export type TeamMembersProps = { title: string; subtitle: string; items: MemberItem[] };

const SAMPLE_ITEMS: MemberItem[] = [
  { avatar: "", name: "张三", role: "创始人 / CEO", bio: "十年行业经验，带领团队从 0 到 1。" },
  { avatar: "", name: "李四", role: "技术总监", bio: "负责整体技术架构与研发团队管理。" },
  { avatar: "", name: "王五", role: "产品负责人", bio: "专注于用户体验与产品迭代。" },
];

// ---------------------------------------------------------------------------
// Component config
// ---------------------------------------------------------------------------

export const TeamMembersConfig: ComponentConfig<TeamMembersProps> = {
  label: "团队成员",

  render({ title, subtitle, items, puck }) {
    return (
      <section ref={puck.dragRef} style={{ maxWidth: 1080, margin: "0 auto" }}>
        <SectionHeading title={title} subtitle={subtitle} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 24 }}>
          {items.map((item, i) => (
            <div
              key={i}
              style={{
                textAlign: "center",
                padding: "32px 20px",
                border: "1px solid #ececec",
                borderRadius: 14,
                background: "#fff",
              }}
            >
              {item.avatar ? (
                <img
                  src={item.avatar}
                  alt={item.name}
                  style={{
                    display: "block",
                    width: 88,
                    height: 88,
                    borderRadius: "50%",
                    objectFit: "cover",
                    margin: "0 auto 14px",
                  }}
                />
              ) : (
                <div
                  style={{
                    width: 88,
                    height: 88,
                    borderRadius: "50%",
                    margin: "0 auto 14px",
                    background: "#eef3ff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 28,
                    color: "#1677ff",
                  }}
                >
                  {(item.name || "人").slice(0, 1)}
                </div>
              )}
              <h3 style={{ fontSize: 17, fontWeight: 600, margin: "0 0 4px", color: "#1f1f1f" }}>{item.name}</h3>
              <div style={{ fontSize: 13, color: "#1677ff", marginBottom: 10 }}>{item.role}</div>
              <p style={{ fontSize: 13, lineHeight: 1.7, color: "rgba(0,0,0,0.6)", margin: 0 }}>{item.bio}</p>
            </div>
          ))}
        </div>
      </section>
    );
  },

  defaultProps: {
    title: "我们的团队",
    subtitle: "一群热爱产品的人",
    items: SAMPLE_ITEMS,
  },

  fields: {
    title: SECTION_TITLE_FIELD,
    subtitle: SECTION_SUBTITLE_FIELD,
    items: {
      type: "array",
      label: "团队成员",
      getItemSummary: (item) => item.name || "未命名",
      defaultItemProps: { avatar: "", name: "姓名", role: "职位", bio: "简介" },
      arrayFields: {
        avatar: {
          type: "custom",
          label: "头像",
          render: ({ value, onChange }) => <MediaField value={value} onChange={onChange} />,
        },
        name: { type: "text", label: "姓名" },
        role: { type: "text", label: "职位" },
        bio: { type: "textarea", label: "简介" },
      },
    },
  },
};
