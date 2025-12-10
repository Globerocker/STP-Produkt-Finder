import React from 'react';
import { ValuePropositionResult } from '../types';
import { HourglassIcon, RocketIcon, SpeedometerIcon, TargetIcon } from './IconComponents';

interface ValuePropositionCardProps {
  value: ValuePropositionResult;
}

const ICONS: { [key in ValuePropositionResult['type']]: React.FC<{className?: string}> } = {
    time: HourglassIcon,
    efficiency: SpeedometerIcon,
    roi: RocketIcon, 
}

const ValuePropositionCard: React.FC<ValuePropositionCardProps> = ({ value }) => {
  const Icon = ICONS[value.type];
  
  return (
    <div className="flex items-start gap-4">
      <div className="flex-shrink-0 bg-brand-accent-light rounded-full p-3">
        <Icon className="h-8 w-8 text-brand-accent" />
      </div>
      <div>
        <h3 className="text-lg font-bold text-brand-primary">{value.title}</h3>
        <p className="text-3xl font-extrabold text-brand-accent">
          {value.value}
          <span className="text-2xl font-bold text-brand-text ml-2">{value.unit}</span>
        </p>
        <p className="text-brand-text text-sm">
          {value.description}
        </p>
      </div>
    </div>
  );
};

export default ValuePropositionCard;
