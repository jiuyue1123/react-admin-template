import { useEffect, useState } from "react";
import {
  App,
  Button,
  Card,
  Empty,
  Pagination,
  Segmented,
  Skeleton,
} from "antd";
import { CheckCircleFilled } from "@ant-design/icons";
import { useRequest, useWatcher } from "alova/client";
import {
  fetchGetMessages,
  fetchMarkAllMessagesRead,
  fetchMarkMessageRead,
} from "@/service/api/message";
import { useMessagesStore } from "@/store/messages";
import { formatDateTime } from "@/utils/date";

const PAGE_SIZE = 10;

/** 站内信中心：系统 / 续费提醒等通知（header 铃铛入口） */
export default function MessagesPage() {
  const { message } = App.useApp();
  const unreadCount = useMessagesStore((state) => state.unreadCount);
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [current, setCurrent] = useState(1);

  const {
    data: page,
    loading,
    error,
    send: reload,
  } = useWatcher(
    () =>
      fetchGetMessages({
        page: current,
        size: PAGE_SIZE,
        unreadOnly: unreadOnly ? true : undefined,
      }),
    [current, unreadOnly],
    { immediate: true },
  );

  const markReadRequest = useRequest((id: number) => fetchMarkMessageRead(id), {
    immediate: false,
  });
  const markAllRequest = useRequest(fetchMarkAllMessagesRead, {
    immediate: false,
  });

  useEffect(() => {
    void useMessagesStore.getState().refreshUnread();
  }, []);

  useEffect(() => {
    if (error) message.error(error.message || "站内信加载失败");
  }, [error, message]);
  useEffect(() => {
    if (markReadRequest.error)
      message.error(markReadRequest.error.message || "标记失败");
  }, [markReadRequest.error, message]);
  useEffect(() => {
    if (markAllRequest.error)
      message.error(markAllRequest.error.message || "操作失败");
  }, [markAllRequest.error, message]);

  const records = page?.records ?? [];
  const total = page?.total ?? 0;

  const handleFilterChange = (value: string | number) => {
    setUnreadOnly(value === "unread");
    setCurrent(1);
  };

  const handleRead = (id: number) => {
    void markReadRequest
      .send(id)
      .then(() => {
        void reload();
        void useMessagesStore.getState().refreshUnread();
      })
      .catch(() => {});
  };

  const handleMarkAll = () => {
    void markAllRequest
      .send()
      .then(() => {
        message.success("已全部标记为已读");
        void reload();
        void useMessagesStore.getState().refreshUnread();
      })
      .catch(() => {});
  };

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-lg font-semibold text-text">站内信</div>
          <div className="mt-0.5 text-sm text-text-secondary">
            系统通知与续费提醒{" "}
            {unreadCount > 0 ? `（${unreadCount} 条未读）` : ""}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Segmented
            value={unreadOnly ? "unread" : "all"}
            onChange={handleFilterChange}
            options={[
              { label: "全部", value: "all" },
              { label: "仅未读", value: "unread" },
            ]}
          />
          <Button
            size="small"
            icon={<CheckCircleFilled />}
            loading={markAllRequest.loading}
            onClick={handleMarkAll}
          >
            全部已读
          </Button>
        </div>
      </div>

      <Card styles={{ body: { padding: 0 } }}>
        {loading && !records.length ? (
          <div className="p-6">
            <Skeleton active paragraph={{ rows: 4 }} />
          </div>
        ) : records.length ? (
          <ul className="divide-y divide-border-secondary">
            {records.map((item) => (
              <MessageRow key={item.id} item={item} onRead={handleRead} />
            ))}
          </ul>
        ) : (
          <Empty
            className="py-16"
            description={unreadOnly ? "没有未读消息" : "暂无站内信"}
          />
        )}
        {total > PAGE_SIZE ? (
          <div className="flex justify-end border-t border-border-secondary px-4 py-3">
            <Pagination
              current={current}
              total={total}
              pageSize={PAGE_SIZE}
              showSizeChanger={false}
              onChange={setCurrent}
            />
          </div>
        ) : null}
      </Card>
    </div>
  );
}

function MessageRow({
  item,
  onRead,
}: {
  item: Api.Message.InAppMessageVO;
  onRead: (id: number) => void;
}) {
  const unread = item.isRead === 0;
  return (
    <li
      role="button"
      tabIndex={0}
      onClick={() => {
        if (unread) onRead(item.id);
      }}
      className={`flex cursor-pointer gap-3 px-5 py-4 transition-colors hover:bg-fill-secondary ${
        unread ? "" : "opacity-70"
      }`}
    >
      <div className="pt-1.5">
        <span
          className={`block h-2 w-2 rounded-full ${unread ? "bg-primary" : "bg-transparent"}`}
        />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span
            className={`text-sm ${unread ? "font-semibold text-text" : "text-text"}`}
          >
            {item.title}
          </span>
          <span className="text-xs text-text-tertiary">
            {formatDateTime(item.gmtCreate)}
          </span>
        </div>
        {item.content ? (
          <p className="mt-1 line-clamp-2 whitespace-pre-line text-sm leading-6 text-text-secondary">
            {item.content}
          </p>
        ) : null}
      </div>
    </li>
  );
}
