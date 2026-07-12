import {
    Truck, Users, MapPin, Wrench, Fuel, BarChart3,
    ShieldCheck, Ban, Gauge, Clock, FileCheck2, TrendingUp,
} from 'lucide-react';

export const NAV_LINKS = [
    { label: 'Platform', href: '#features' },
    { label: 'How it works', href: '#how-it-works' },
    { label: 'Roles', href: '#roles' },
    { label: 'FAQ', href: '#faq' },
];

export const FEATURES = [
    {
        icon: Truck,
        title: 'Vehicle Registry',
        copy: 'Every unit lives in one master list — registration, model, load capacity, odometer, acquisition cost — with status that locks automatically the moment it leaves the yard.',
        stat: '4',
        statLabel: 'lifecycle states',
        span: 'wide',
    },
    {
        icon: Users,
        title: 'Driver Management',
        copy: 'License category, expiry date, and safety score sit next to every profile, so a lapsed license simply cannot reach the dispatch pool.',
        stat: '100%',
        statLabel: 'compliance checked',
        span: 'tall',
    },
    {
        icon: MapPin,
        title: 'Trip Dispatch',
        copy: 'Draft, dispatch, complete, cancel — cargo weight is checked against capacity before a trip ever leaves Draft.',
        stat: '0',
        statLabel: 'overload dispatches',
    },
    {
        icon: Wrench,
        title: 'Maintenance Workflow',
        copy: 'Open a service record and the vehicle status flips to In Shop on its own, pulled out of the driver selection pool until it closes.',
        stat: 'Auto',
        statLabel: 'status locking',
    },
    {
        icon: Fuel,
        title: 'Fuel & Expense Logs',
        copy: 'Liters, cost, tolls, and shop bills roll up into one operational cost figure per vehicle — no spreadsheet reconciliation.',
        stat: '1',
        statLabel: 'source of truth',
    },
    {
        icon: BarChart3,
        title: 'Reports & Analytics',
        copy: 'Fuel efficiency, fleet utilization, and vehicle ROI, exportable to CSV the moment a stakeholder asks.',
        stat: 'CSV',
        statLabel: 'export ready',
        span: 'wide',
    },
];

export const WORKFLOW_STEPS = [
    {
        index: '01',
        title: 'Register the asset',
        copy: 'Van-05 goes into the registry with a 500kg capacity ceiling and an Available status.',
        tag: 'VEHICLE',
    },
    {
        index: '02',
        title: 'Clear the driver',
        copy: 'Alex is added with a valid license — the system already knows not to assign a suspended or expired one.',
        tag: 'DRIVER',
    },
    {
        index: '03',
        title: 'Dispatch the trip',
        copy: '450kg of cargo checks against the 500kg ceiling, passes, and both vehicle and driver flip to On Trip.',
        tag: 'TRIP',
    },
    {
        index: '04',
        title: 'Close the loop',
        copy: 'Final odometer and fuel consumed are logged, both assets return to Available, and the report updates itself.',
        tag: 'COMPLETE',
    },
];

export const TRIP_LIFECYCLE = [
    { label: 'Draft', desc: 'Route, cargo, and assets selected — nothing is committed yet.' },
    { label: 'Dispatched', desc: 'Vehicle and driver locked to this trip and marked On Trip.' },
    { label: 'Completed', desc: 'Odometer and fuel logged; both assets return to Available.' },
    { label: 'Cancelled', desc: 'Trip stood down; vehicle and driver restored to Available.' },
];

export const STATS = [
    { value: 98.4, suffix: '%', decimals: 1, label: 'Rule-checked dispatches', icon: ShieldCheck },
    { value: 0, suffix: '', decimals: 0, label: 'Double-booked assets', icon: Ban },
    { value: 32, suffix: '%', decimals: 0, label: 'Avg. utilization lift', icon: Gauge },
    { value: 6, suffix: 'hrs', decimals: 0, label: 'Saved per week, per manager', icon: Clock },
];

export const WHY_POINTS = [
    {
        icon: Ban,
        title: 'Conflicts are prevented, not caught later',
        copy: 'A vehicle or driver already On Trip is removed from the selection pool at the source — there is no double-booking to reconcile after the fact.',
    },
    {
        icon: FileCheck2,
        title: 'Compliance is structural',
        copy: 'Expired licenses and suspended drivers are filtered out before a dispatch form can even be submitted.',
    },
    {
        icon: Gauge,
        title: 'Status updates itself',
        copy: 'Dispatch, complete, cancel, or open a maintenance record — vehicle and driver status transitions happen automatically, every time.',
    },
    {
        icon: TrendingUp,
        title: 'Every number rolls up to ROI',
        copy: 'Fuel, maintenance, and revenue feed one formula per vehicle, so profitability is always one click away.',
    },
];

export const ROLES = [
    {
        role: 'Fleet Manager',
        headline: 'See the whole yard at once',
        copy: 'Active, available, and in-shop vehicles, fleet utilization, and lifecycle health — one dashboard, filtered by type, status, or region.',
        icon: Truck,
    },
    {
        role: 'Driver',
        headline: 'Only valid options, ever',
        copy: 'Create and monitor trips against a pool of vehicles and drivers that are already known to be available and compliant.',
        icon: MapPin,
    },
    {
        role: 'Safety Officer',
        headline: 'Compliance you can prove',
        copy: 'License validity and safety scores tracked per driver, with expiring credentials surfaced before they lapse.',
        icon: ShieldCheck,
    },
    {
        role: 'Financial Analyst',
        headline: 'Cost and ROI, per vehicle',
        copy: 'Operational cost, fuel efficiency, and ROI computed automatically from live fuel, maintenance, and revenue data.',
        icon: BarChart3,
    },
];

export const TESTIMONIALS = [
    {
        quote: "We stopped finding out about an expired license the same week a truck was already loaded. Now it just can't be dispatched.",
        name: 'Operations Lead',
        org: 'Regional freight carrier',
    },
    {
        quote: 'Maintenance used to live in a notebook in the shop. Now a vehicle disappears from dispatch the second a job opens against it.',
        name: 'Fleet Manager',
        org: 'Municipal transport fleet',
    },
    {
        quote: 'ROI per vehicle used to take an afternoon in a spreadsheet. It is now a number that is just already there.',
        name: 'Financial Analyst',
        org: 'Last-mile delivery network',
    },
];

export const FAQS = [
    {
        q: 'How does FleetFlow prevent double-booking?',
        a: 'The moment a vehicle or driver is dispatched to a trip, their status changes to On Trip and they are removed from the selection pool for any new trip — the conflict is prevented at the point of assignment, not flagged afterward.',
    },
    {
        q: 'What happens when I open a maintenance record?',
        a: 'The linked vehicle status automatically switches to In Shop, which pulls it out of dispatch selection. Closing the record restores it to Available, unless it has been marked Retired.',
    },
    {
        q: 'Can a driver with an expired license be assigned to a trip?',
        a: 'No. Expired licenses and Suspended drivers are excluded from the assignable pool by rule — there is no manual step that can be skipped.',
    },
    {
        q: 'How is Vehicle ROI calculated?',
        a: 'ROI is (Revenue − (Maintenance + Fuel)) ÷ Acquisition Cost, computed per vehicle from the fuel logs, maintenance records, and trip revenue already in the system.',
    },
    {
        q: 'Can I get the data out?',
        a: 'Every report supports CSV export, so utilization, cost, and ROI figures can move into whatever spreadsheet or BI tool your team already reports with.',
    },
];
