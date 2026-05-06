import { Card } from "@/components/ui/card";

export default function StatsCard({ title, value, icon: Icon, color, subtitle }) {
  return (
    <Card className="relative overflow-hidden p-6">
      <div className={`absolute top-0 right-0 w-24 h-24 ${color} rounded-full -translate-y-6 translate-x-6 opacity-10`} />
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground font-medium">{title}</p>
          <p className="text-3xl font-bold text-foreground mt-1">{value}</p>
          {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
        </div>
        <div className={`w-12 h-12 rounded-2xl ${color} bg-opacity-10 flex items-center justify-center`}>
          <Icon className={`w-6 h-6 ${color.replace("bg-", "text-")}`} />
        </div>
      </div>
    </Card>
  );
}
