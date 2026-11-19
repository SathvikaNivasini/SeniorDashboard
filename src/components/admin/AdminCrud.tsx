"use client";

import { useEffect, useState } from "react";
import { getBrowserClient } from "@/lib/supabase/client";
import { useHubData } from "@/lib/data-provider";
import { EmptyState } from "@/components/ui";
import {
  PlusIcon, PencilIcon, TrashIcon, XIcon, ICON_CHOICES, ResourceGlyph,
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

export default function AdminCrud<T extends Row>({
  table,
  singular,
  fields,
  defaults,
  rows,
  renderRow,
  emptyMessage,
}: {
  table: TableName;
  singular: string;
  fields: FieldDef[];
  defaults: Record<string, unknown>;
  rows: T[];
  renderRow: (row: T) => React.ReactNode;
  emptyMessage: string;
}) {
  const { refresh } = useHubData();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<T | null>(null);
  const [form, setForm] = useState<Record<string, unknown>>(defaults);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [flash, setFlash] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  useEffect(() => {
    if (!flash) return;
    const t = setTimeout(() => setFlash(null), 2800);
    return () => clearTimeout(t);
  }, [flash]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeForm();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  function openNew() {
    setEditing(null);
    setForm(defaults);
    setError(null);
    setOpen(true);
  }

  function openEdit(row: T) {
    setEditing(row);
    const next: Record<string, unknown> = {};
    fields.forEach((f) => {
      const v = row[f.name];
      next[f.name] = v ?? defaults[f.name] ?? "";
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

    const query = editing
      ? supabase.from(table).update(payload).eq("id", editing.id)
      : supabase.from(table).insert(payload);

    const { error: writeError } = await query;
    setBusy(false);

    if (writeError) {
      setError(writeError.message);
      return;
    }

    await refresh();
    setFlash(editing ? `${singular} updated.` : `${singular} posted.`);
    closeForm();
  }

  async function remove(id: string) {
    setBusy(true);
    const supabase = getBrowserClient();
    const { error: delError } = await supabase.from(table).delete().eq("id", id);
    setBusy(false);
    setConfirmId(null);

    if (delError) {
      setFlash(null);
      setError(delError.message);
      return;
    }
    await refresh();
    setFlash(`${singular} deleted.`);
  }

  return (
    <>
      <div className="mb-5 flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={openNew}
          className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-[14.5px] font-semibold text-white transition hover:bg-ink/85"
        >
          <PlusIcon className="h-[17px] w-[17px]" strokeWidth={2.3} />
          New {singular}
        </button>
        {flash && (
          <span role="status" className="rounded-full bg-mint px-4 py-2 text-[13.5px] font-medium text-ink">
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
            <div key={row.id} className="hub-card flex items-start gap-4 p-4 sm:p-5">
              <div className="min-w-0 flex-1">{renderRow(row)}</div>
              <div className="flex shrink-0 items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => openEdit(row)}
                  aria-label={`Edit ${singular.toLowerCase()}`}
                  className="flex h-9 w-9 items-center justify-center rounded-full text-ink/55 transition hover:bg-peach-soft hover:text-ink"
                >
                  <PencilIcon className="h-[17px] w-[17px]" />
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmId(row.id)}
                  aria-label={`Delete ${singular.toLowerCase()}`}
                  className="flex h-9 w-9 items-center justify-center rounded-full text-ink/55 transition hover:bg-[#fde0dd] hover:text-[#9c1f24]"
                >
                  <TrashIcon className="h-[17px] w-[17px]" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete confirmation */}
      {confirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/45 px-5 backdrop-blur-sm">
          <div className="hub-card w-full max-w-[400px] p-6">
            <h3 className="font-display text-[21px] font-bold tracking-tight text-ink">
              Delete this {singular.toLowerCase()}?
            </h3>
            <p className="mt-2 text-[14.5px] text-ink/65">
              Students will stop seeing it right away. This can&rsquo;t be undone.
            </p>
            <div className="mt-5 flex gap-2.5">
              <button
                type="button"
                onClick={() => remove(confirmId)}
                disabled={busy}
                className="flex-1 rounded-2xl bg-[#9c1f24] py-3 text-[14.5px] font-semibold text-white transition hover:bg-[#86191e] disabled:opacity-50"
              >
                {busy ? "Deleting…" : "Delete"}
              </button>
              <button
                type="button"
                onClick={() => setConfirmId(null)}
                className="flex-1 rounded-2xl bg-peach-soft py-3 text-[14.5px] font-semibold text-ink transition hover:bg-peach"
              >
                Keep it
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create / edit form */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-ink/45 px-5 py-10 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && closeForm()}
        >
          <form
            onSubmit={save}
            className="hub-card w-full max-w-[560px] p-6 sm:p-7"
          >
            <div className="flex items-start justify-between gap-4">
              <h3 className="font-display text-[24px] font-bold tracking-tight text-ink">
                {editing ? `Edit ${singular}` : `New ${singular}`}
              </h3>
              <button
                type="button"
                onClick={closeForm}
                aria-label="Close"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-ink/50 transition hover:bg-peach-soft hover:text-ink"
              >
                <XIcon className="h-[18px] w-[18px]" />
              </button>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {fields.map((f) => (
                <div key={f.name} className={f.full || f.type === "textarea" ? "sm:col-span-2" : ""}>
                  {f.type === "checkbox" ? (
                    <label className="flex cursor-pointer items-center gap-3 rounded-2xl bg-peach-soft/70 px-4 py-3">
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
                      <label
                        htmlFor={`fld-${f.name}`}
                        className="block text-[13.5px] font-semibold text-ink/70"
                      >
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
                          className="mt-2 w-full resize-y rounded-2xl border border-ink/12 bg-white px-4 py-3 text-[15px] text-ink outline-none transition placeholder:text-ink/30 focus:border-gold focus:ring-4 focus:ring-gold/15"
                        />
                      ) : (
                        <input
                          id={`fld-${f.name}`}
                          type={f.type === "number" ? "number" : f.type}
                          required={f.required}
                          value={String(form[f.name] ?? "")}
                          placeholder={f.placeholder}
                          onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}
                          className="mt-2 w-full rounded-2xl border border-ink/12 bg-white px-4 py-3 text-[15px] text-ink outline-none transition placeholder:text-ink/30 focus:border-gold focus:ring-4 focus:ring-gold/15"
                        />
                      )}
                      {f.help && <p className="mt-1.5 text-[12.5px] text-ink/45">{f.help}</p>}
                    </>
                  )}
                </div>
              ))}
            </div>

            {error && (
              <p role="alert" className="mt-4 rounded-2xl bg-[#fde0dd] px-4 py-3 text-[14px] text-[#9c1f24]">
                {error}
              </p>
            )}

            <div className="mt-6 flex gap-2.5">
              <button
                type="submit"
                disabled={busy}
                className="flex-1 rounded-2xl bg-ink py-3.5 text-[15px] font-semibold text-white transition hover:bg-ink/88 disabled:opacity-50"
              >
                {busy ? "Saving…" : editing ? "Save changes" : `Post ${singular.toLowerCase()}`}
              </button>
              <button
                type="button"
                onClick={closeForm}
                className="rounded-2xl bg-peach-soft px-6 py-3.5 text-[15px] font-semibold text-ink transition hover:bg-peach"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
