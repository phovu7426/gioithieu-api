import { ValueObject } from '@/common/base/domain/value-object.base';
import { ValidationException } from '@/domain/exceptions';

interface DateRangeProps {
    startDate: Date;
    endDate: Date;
}

/**
 * DateRange Value Object
 * Represents a date range with validation
 */
export class DateRange extends ValueObject<DateRangeProps> {
    private constructor(props: DateRangeProps) {
        super(props);
    }

    /**
     * Create a DateRange value object
     * @throws ValidationException if end date is before start date
     */
    static create(startDate: Date, endDate: Date): DateRange {
        if (!(startDate instanceof Date) || !(endDate instanceof Date)) {
            throw new ValidationException('Start date and end date must be valid Date objects');
        }

        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
            throw new ValidationException('Start date and end date must be valid dates');
        }

        if (endDate < startDate) {
            throw new ValidationException('End date must be after or equal to start date');
        }

        return new DateRange({ startDate, endDate });
    }

    get startDate(): Date {
        return this.props.startDate;
    }

    get endDate(): Date {
        return this.props.endDate;
    }

    get value(): DateRangeProps {
        return this.props;
    }

    /**
     * Get the duration in days
     */
    getDurationInDays(): number {
        const diffTime = this.props.endDate.getTime() - this.props.startDate.getTime();
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    /**
     * Check if a date is within this range
     */
    contains(date: Date): boolean {
        return date >= this.props.startDate && date <= this.props.endDate;
    }

    /**
     * Check if this range overlaps with another range
     */
    overlaps(other: DateRange): boolean {
        return (
            this.props.startDate <= other.endDate && this.props.endDate >= other.startDate
        );
    }
}
