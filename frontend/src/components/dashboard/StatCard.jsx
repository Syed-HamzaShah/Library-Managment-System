import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

const variantStyles = {
    default: 'bg-card border-border',
    primary: 'bg-primary text-primary-foreground',
    accent: 'gradient-accent text-accent-foreground',
    success: 'bg-success text-success-foreground',
    warning: 'bg-warning text-warning-foreground',
};

export function StatCard({ title, value, icon, trend, variant = 'default' }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className={cn(
                'rounded-2xl p-6 border shadow-sm transition-shadow hover:shadow-lg',
                variantStyles[variant]
            )}
        >
            <div className="flex items-start justify-between">
                <div>
                    <p className={cn('text-sm font-medium mb-1', variant === 'default' ? 'text-muted-foreground' : 'opacity-80')}>
                        {title}
                    </p>
                    <p className="text-3xl font-bold tracking-tight">{value}</p>
                    {trend && (
                        <p className={cn('text-sm mt-2', trend.isPositive ? 'text-success' : 'text-destructive')}>
                            {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}% from last month
                        </p>
                    )}
                </div>
                <div className={cn('p-3 rounded-xl', variant === 'default' ? 'bg-secondary' : 'bg-white/20')}>
                    {icon}
                </div>
            </div>
        </motion.div>
    );
}
