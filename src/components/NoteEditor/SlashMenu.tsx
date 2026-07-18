import "./SlashMenu.css";

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
  if (items.length === 0) {
    return (
      <div className="slash-menu">
        <div className="slash-menu-empty">
          Ingen kommandoer funnet
        </div>
      </div>
    );
  }

  return (
    <div className="slash-menu">
      {items.map((item, index) => {
        const Icon = item.icon;

        return (
          <button
            key={item.title}
            type="button"
            className={`slash-menu-item ${
              index === selectedIndex
                ? "is-selected"
                : ""
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