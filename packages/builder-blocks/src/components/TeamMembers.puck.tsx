import type { ComponentConfig } from "@puckeditor/core";
import { BlockStyles } from "./block-styles";
import { MediaField } from "./media-field";
import { SectionHeading } from "./SectionHeading";
import {
  bgClass,
  colsClass,
  GRID_COLUMNS_FIELD,
  padClass,
  BLOCK_BACKGROUND_FIELD,
  SECTION_SPACING_FIELD,
  SECTION_SUBTITLE_FIELD,
  SECTION_TITLE_FIELD,
} from "./shared";
import { themeVar } from "../theme";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type MemberItem = { avatar: string; name: string; role: string; bio: string };
export type TeamMembersProps = {
  title: string;
  subtitle: string;
  items: MemberItem[];
  background: string;
  spacing: string;
  columns: string;
};

const SAMPLE_ITEMS: MemberItem[] = [
  { avatar: "", name: "张三", role: "创始人 / CEO", bio: "十年行业经验，带队从零搭建产品体系。" },
  { avatar: "", name: "李四", role: "技术总监", bio: "负责整体技术架构与研发团队管理。" },
  { avatar: "", name: "王五", role: "产品负责人", bio: "专注于用户体验与产品迭代。" },
];

// ---------------------------------------------------------------------------
// Component config
// ---------------------------------------------------------------------------

export const TeamMembersConfig: ComponentConfig<TeamMembersProps> = {
  label: "团队成员",

  render({ title, subtitle, items, background, spacing, columns, puck }) {
    const bandCls = ["jff-band", "jff-team", bgClass(background), padClass(spacing)].filter(Boolean).join(" ");
    const gridCls = ["jff-grid", colsClass(columns)].filter(Boolean).join(" ");
    return (
      <section ref={puck.dragRef} className={bandCls}>
        <BlockStyles />
        <div className="jff-section">
          <SectionHeading title={title} subtitle={subtitle} />
          <div className={gridCls}>
            {items.map((item, i) => (
              <div
                key={i}
                className="jff-team__card jff-surface"
                style={{
                  textAlign: "center",
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
                      background: themeVar("colorBrandSubtle"),
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 28,
                      color: themeVar("colorBrand"),
                    }}
                  >
                    {(item.name || "人").slice(0, 1)}
                  </div>
                )}
                <h3 style={{ fontSize: 17, fontWeight: 600, margin: "0 0 4px", color: themeVar("colorText") }}>
                  {item.name}
                </h3>
                <div style={{ fontSize: 13, color: themeVar("colorBrand"), marginBottom: 10 }}>{item.role}</div>
                <p style={{ fontSize: 13, lineHeight: 1.7, color: themeVar("colorTextSecondary"), margin: 0 }}>
                  {item.bio}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  },

  defaultProps: {
    title: "我们的团队",
    subtitle: "以下是团队主要成员",
    items: SAMPLE_ITEMS,
    background: "",
    spacing: "",
    columns: "",
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
    columns: GRID_COLUMNS_FIELD,
    background: BLOCK_BACKGROUND_FIELD,
    spacing: SECTION_SPACING_FIELD,
  },
};
