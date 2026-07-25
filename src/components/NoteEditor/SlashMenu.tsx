import "./SlashMenu.css";

import { useEffect, useRef } from "react";
import type { SlashCommandItem } from "./slashCommands";

type SlashMenuProps = {
  items: SlashCommandItem[];
  selectedIndex: number;
  onSelect: (item: SlashCommandItem) => void;
};

export const SlashMenu = ({
  items,
  selectedIndex,
  onSelect,
}: SlashMenuProps) => {
  const selectedItemRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    selectedItemRef.current?.scrollIntoView({
      block: "nearest",
    });
  }, [selectedIndex]);

  if (items.length === 0) {
    return (
      <div className="slash-menu" role="listbox">
        <div className="slash-menu-empty">
          Ingen kommandoer funnet
        </div>
      </div>
    );
  }

  return (
    <div
      className="slash-menu"
      role="listbox"
      aria-label="Kommandoer"
    >
      {items.map((item, index) => {
        const Icon = item.icon;
        const isSelected = index === selectedIndex;

        return (
          <button
            key={item.title}
            ref={isSelected ? selectedItemRef : null}
            type="button"
            role="option"
            aria-selected={isSelected}
            className={`slash-menu-item ${
              isSelected ? "is-selected" : ""
            }`}
            onMouseDown={(event) => {
              event.preventDefault();
              onSelect(item);
            }}
          >
            <div className="slash-menu-icon">
              <Icon size={18} />
            </div>

            <div className="slash-menu-text">
              <div className="slash-menu-title">
                {item.title}
              </div>

              <div className="slash-menu-description">
                {item.description}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
};