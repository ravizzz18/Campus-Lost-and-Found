import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ItemReport } from '@/types';
import { formatCategory, formatDate } from '@/utils/formatters';
import { MapPin, Clock, ArrowRight } from 'lucide-react';

interface ItemCardProps {
  item: ItemReport;
  className?: string;
}

export const ItemCard: React.FC<ItemCardProps> = ({ item, className = '' }) => {
  const isLost = item.type === 'lost';

  return (
    <Card hoverEffect className={`flex flex-col justify-between overflow-hidden ${className}`}>
      <div>
        {/* Photo preview or Category header */}
        {item.images && item.images.length > 0 ? (
          <div className="relative h-44 -mx-6 -mt-6 mb-4 overflow-hidden bg-slate-100 border-b border-slate-100">
            <img
              src={item.images[0]}
              alt={item.title}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            />
            <div className="absolute top-3 left-3 flex gap-1.5">
              <Badge variant={isLost ? 'lost' : 'found'}>
                {isLost ? 'Lost Item' : 'Found Item'}
              </Badge>
              {item.status === 'resolved' && (
                <Badge variant="resolved">Resolved</Badge>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between mb-3.5">
            <div className="flex items-center gap-2">
              <Badge variant={isLost ? 'lost' : 'found'}>
                {isLost ? 'Lost Item' : 'Found Item'}
              </Badge>
              <span className="text-[11px] font-mono text-slate-400">#{item.id}</span>
            </div>
            {item.status === 'resolved' ? (
              <Badge variant="resolved">Resolved</Badge>
            ) : (
              <span className="text-xs text-slate-400 flex items-center gap-1 font-normal">
                <Clock className="w-3.5 h-3.5" />
                {formatDate(item.dateReported)}
              </span>
            )}
          </div>
        )}

        <div className="space-y-1.5">
          <span className="text-xs font-semibold text-royal-600 tracking-wide uppercase">
            {formatCategory(item.category)}
          </span>
          <h3 className="text-base font-bold text-navy-800 line-clamp-1 leading-snug">
            <Link to={`/item/${item.id}`} className="hover:text-royal-600 transition-colors">
              {item.title}
            </Link>
          </h3>
          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        </div>
      </div>

      <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span className="flex items-center gap-1.5 text-slate-700 font-medium truncate max-w-[65%]">
          <MapPin className="w-3.5 h-3.5 text-royal-500 flex-shrink-0" />
          <span className="truncate">{item.location}</span>
        </span>
        <Link
          to={`/item/${item.id}`}
          className="font-semibold text-royal-600 hover:text-royal-700 inline-flex items-center gap-1 group flex-shrink-0"
        >
          <span>Details</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </Card>
  );
};
