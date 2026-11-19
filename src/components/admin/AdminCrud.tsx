"use client";

import {
  forwardRef, useCallback, useEffect, useImperativeHandle, useState,
} from "react";
import { getBrowserClient } from "@/lib/supabase/client";
import { useHubData } from "@/lib/data-provider";
import { EmptyState } from "@/components/ui";
import Modal from "@/components/Modal";
import {
  PlusIcon, PencilIcon, TrashIcon, ICON_CHOICES, ResourceGlyph,
} from "@/components/icons";
import type { TableName } from "@/lib/types";

export type FieldDef = {
  name: string;
  label: string;
  type: "text" | "textarea" | "date" | "checkbox" | "number" | "icon";
  required?: boolean;
  placeholder?: string;
  help?: string;
  full?: boolean;
};

type Row = Record<string, unknown> & { id: string };

export type AdminCrudHandle = {
  /** Open a blank form, optionally pre-filling some fields. */
  openNew: (prefill?: Record<string, unknown>) => void;
};

function AdminCrudInner<T extends Row>(
  {
    table, singular, fields, defaults, rows, renderRow, emptyMessage,
  }: {
    table: TableName;
    singular: string;
    fields: FieldDef[];
    defaults: Record<string, unknown>;
    rows: T[];
    renderRow: (row: T) => React.ReactNode;
    emptyMessage: string;
  },
  ref: React.Ref<AdminCrudHandle>,
) {
  const { refresh } = useHubData();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<T | null>(null);
  const [form, setForm] = useState<Record<string, unknown>>(defaults);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [flash, setFlash] = useState<string | null>(null);
  const [confirming, setConfirming] = useState<T | null>(null);

  useEffect(() => {
    if (!flash) return;
    const t = setTimeout(() => setFlash(null), 3200);
    return () => clearTimeout(t);
  }, [flash]);

  const openNew = useCallback(
    (prefill?: Record<string, unknown>) => {
      setEditing(null);
      setForm({ ...defaults, ...(prefill ?? {}) });
      setError(null);
      setOpen(true);
    },
    [defaults],
  );

  useImperativeHandle(ref, () => ({ openNew }), [openNew]);

  function openEdit(row: T) {
    setEditing(row);
    const next: Record<string, unknown> = {};
    fields.forEach((f) => {
      next[f.name] = row[f.name] ?? defaults[f.name] ?? "";
    });
    setForm(next);
    setError(null);
    setOpen(true);
  }

  function closeForm() {
    setOpen(false);
    setEditing(null);
    setError(null);
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);

    const supabase = getBrowserClient();
    const payload: Record<string, unknown> = {};
    fields.forEach((f) => {
      let v = form[f.name];
      if (f.type === "number") v = Number(v) || 0;
      if (typeof v === "string" && v.trim() === "" && !f.required) v = null;
      payload[f.name] = v;
    });

    const { error: writeError } = editing
      ? await supabase.from(table).update(payload).eq("id", editing.id)
      : await supabase.from(table).insert(payload);

    setBusy(false);
    if (writeError) {
      setError(writeError.message);
      return;
    }

    await refresh();
    setFlash(editing ? `${singular} updated.` : `${singular} posted.`);
    closeForm();
  }

  async function remove(row: T) {
    setBusy(true);
    const supabase = getBrowserClient();
    const { error: delError } = await supabase.from(table).delete().eq("id", row.id);
    setBusy(false);
    setConfirming(null);

    if (delError) {
      setError(delError.message);
      return;
    }
    await refresh();
    setFlash(`${singular} deleted.`);
  }

  const lower = singular.toLowerCase();

  return (
    <>
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => openNew()}
          className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-[14.5px] font-semibold text-white transition hover:bg-ink/85 active:scale-[0.98]"
        >
          <PlusIcon className="h-[17px] w-[17px]" strokeWidth={2.3} />
          New {singular}
        </button>
        {flash && (
          <span
            role="status"
            className="animate-in-up rounded-full bg-mint px-4 py-2 text-[13.5px] font-medium text-ink"
          >
            {flash}
          </span>
        )}
      </div>

      {error && !open && (
        <p role="alert" className="mb-4 rounded-2xl bg-[#fde0dd] px-4 py-3 text-[14px] text-[#9c1f24]">
          {error}
        </p>
      )}

      {rows.length === 0 ? (
        <EmptyState message={emptyMessage} />
      ) : (
        <div className="flex flex-col gap-3">
          {rows.map((row) => (
            <div
              key={row.id}
              className="hub-card flex flex-col gap-3 p-4 sm:flex-row sm:items-start sm:gap-4 sm:p-5"
            >
              <div className="min-w-0 flex-1">{renderRow(row)}</div>
              <div className="flex shrink-0 items-center gap-1.5 border-t border-ink/[0.06] pt-3 sm:border-0 sm:pt-0">
                <button
                  type="button"
                  onClick={() => openEdit(row)}
                  className="flex h-10 items-center gap-2 rounded-full px-3.5 text-[13.5px] font-medium text-ink/60 transition hover:bg-peach-soft hover:text-ink sm:h-9 sm:w-9 sm:justify-center sm:px-0"
                >
                  <PencilIcon className="h-[17px] w-[17px] shrink-0" />
                  <span className="sm:hidden">Edit</span>
                </button>
                <button
                  type="button"
                  onClick={() => setConfirming(row)}
                  className="flex h-10 items-center gap-2 rounded-full px-3.5 text-[13.5px] font-medium text-ink/60 transition hover:bg-[#fde0dd] hover:text-[#9c1f24] sm:h-9 sm:w-9 sm:justify-center sm:px-0"
                >
                  <TrashIcon className="h-[17px] w-[17px] shrink-0" />
                  <span className="sm:hidden">Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete confirmation */}
      <Modal
        open={Boolean(confirming)}
        onClose={() => setConfirming(null)}
        title={`Delete this ${lower}?`}
        maxWidth="420px"
        footer={
          <div className="flex flex-col gap-2.5 sm:flex-row">
            <button
              type="button"
              onClick={() => confirming && remove(confirming)}
              disabled={busy}
              className="flex-1 rounded-2xl bg-[#9c1f24] py-3.5 text-[15px] font-semibold text-white transition hover:bg-[#86191e] disabled:opacity-50"
            >
              {busy ? "Deleting…" : "Delete"}
            </button>
            <button
              type="button"
              onClick={() => setConfirming(null)}
              className="flex-1 rounded-2xl bg-peach-soft py-3.5 text-[15px] font-semibold text-ink transition hover:bg-peach"
            >
              Keep it
            </button>
          </div>
        }
      >
        <p className="text-[14.5px] leading-relaxed text-ink/65">
          Students will stop seeing it right away. This can&rsquo;t be undone.
        </p>
      </Modal>

      {/* Create / edit */}
      <Modal
        open={open}
        onClose={closeForm}
        title={editing ? `Edit ${singular}` : `New ${singular}`}
        footer={
          <div className="flex flex-col gap-2.5 sm:flex-row">
            <button
              type="submit"
              form="admin-crud-form"
              disabled={busy}
              className="flex-1 rounded-2xl bg-ink py-3.5 text-[15px] font-semibold text-white transition hover:bg-ink/88 disabled:opacity-50"
            >
              {busy ? "Saving…" : editing ? "Save changes" : `Post ${lower}`}
            </button>
            <button
              type="button"
              onClick={closeForm}
              className="rounded-2xl bg-peach-soft py-3.5 text-[15px] font-semibold text-ink transition hover:bg-peach sm:px-7"
            >
              Cancel
            </button>
          </div>
        }
      >
        <form id="admin-crud-form" onSubmit={save} className="grid gap-4 sm:grid-cols-2">
          {fields.map((f) => (
            <div key={f.name} className={f.full || f.type === "textarea" ? "sm:col-span-2" : ""}>
              {f.type === "checkbox" ? (
                <label className="flex cursor-pointer items-center gap-3 rounded-2xl bg-peach-soft/70 px-4 py-3.5">
                  <input
                    type="checkbox"
                    checked={Boolean(form[f.name])}
                    onChange={(e) => setForm({ ...form, [f.name]: e.target.checked })}
                    className="h-[18px] w-[18px] accent-[#e08f2e]"
                  />
                  <span className="text-[14.5px] font-medium text-ink">{f.label}</span>
                </label>
              ) : (
                <>
                  <label htmlFor={`fld-${f.name}`} className="block text-[13.5px] font-semibold text-ink/70">
                    {f.label}
                    {f.required && <span className="text-[#c1272d]"> *</span>}
                  </label>

                  {f.type === "icon" ? (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {ICON_CHOICES.map((key) => (
                        <button
                          key={key}
                          type="button"
                          onClick={() => setForm({ ...form, [f.name]: key })}
                          aria-label={key}
                          aria-pressed={form[f.name] === key}
                          className={`flex h-11 w-11 items-center justify-center rounded-2xl border transition ${
                            form[f.name] === key
                              ? "border-gold bg-peach text-ink"
                              : "border-ink/10 bg-white text-ink/55 hover:border-gold/50"
                          }`}
                        >
                          <ResourceGlyph name={key} className="h-5 w-5" />
                        </button>
                      ))}
                    </div>
                  ) : f.type === "textarea" ? (
                    <textarea
                      id={`fld-${f.name}`}
                      required={f.required}
                      rows={5}
                      value={String(form[f.name] ?? "")}
                      placeholder={f.placeholder}
                      onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}
                      className="mt-2 w-full resize-y rounded-2xl border border-ink/12 bg-white px-4 py-3 text-[16px] text-ink outline-none transition placeholder:text-ink/30 focus:border-gold focus:ring-4 focus:ring-gold/15"
                    />
                  ) : (
                    <input
                      id={`fld-${f.name}`}
                      type={f.type === "number" ? "number" : f.type}
                      required={f.required}
                      value={String(form[f.name] ?? "")}
                      placeholder={f.placeholder}
                      onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}
                      className="mt-2 w-full rounded-2xl border border-ink/12 bg-white px-4 py-3 text-[16px] text-ink outline-none transition placeholder:text-ink/30 focus:border-gold focus:ring-4 focus:ring-gold/15"
                    />
                  )}
                  {f.help && <p className="mt-1.5 text-[12.5px] text-ink/45">{f.help}</p>}
                </>
              )}
            </div>
          ))}

          {error && (
            <p role="alert" className="rounded-2xl bg-[#fde0dd] px-4 py-3 text-[14px] text-[#9c1f24] sm:col-span-2">
              {error}
            </p>
          )}
        </form>
      </Modal>
    </>
  );
}

/** forwardRef with a generic row type preserved. */
const AdminCrud = forwardRef(AdminCrudInner) as <T extends Row>(
  props: {
    table: TableName;
    singular: string;
    fields: FieldDef[];
    defaults: Record<string, unknown>;
    rows: T[];
    renderRow: (row: T) => React.ReactNode;
    emptyMessage: string;
  } & { ref?: React.Ref<AdminCrudHandle> },
) => React.ReactElement;

export default AdminCrud;
