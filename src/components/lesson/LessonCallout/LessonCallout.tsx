import "./LessonCallout.css";

type CalloutType = "tip" | "warning" | "note";

type LessonCalloutProps = {
  type: CalloutType;
  children: React.ReactNode;
};

const calloutContent = {
  tip: {
    label: "Tips",
    icon: "💡",
  },
  warning: {
    label: "Vanlig feil",
    icon: "⚠️",
  },
  note: {
    label: "Husk",
    icon: "📝",
  },
};

export function LessonCallout({
  type,
  children,
}: LessonCalloutProps) {
  const content = calloutContent[type];

  return (
    <div className={`lesson-callout lesson-callout-${type}`}>
      <div className="lesson-callout-header">
        <span>{content.icon}</span>
        <strong>{content.label}</strong>
      </div>

      <p>{children}</p>
    </div>
  );
}