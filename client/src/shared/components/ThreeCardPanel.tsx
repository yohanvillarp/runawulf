import { Link } from "react-router-dom";
import type { LucideIcon } from "lucide-react";

interface Card {
  title: string;
  icon: LucideIcon;
  to: string;
  description: string;
}

interface ThreeCardPanelProps {
  cards: Card[];
}

export const ThreeCardPanel = ({ cards }: ThreeCardPanelProps) => {
  return (
    <div className="w-full flex flex-col md:flex-row justify-center gap-6">
      {cards.map((card, idx) => (
        <Link
          key={idx}
          to={card.to}
          className="flex-1 bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center hover:scale-105 transition-transform"
        >
          <card.icon size={60} className="text-blue-500 mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">{card.title}</h2>
          <p className="text-gray-600 text-center">{card.description}</p>
        </Link>
      ))}
    </div>
  );
};
