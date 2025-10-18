import React, { useState, useEffect, useMemo } from "react";
import "./Donations.css";

const Donations = () => {
    const [timePeriod, setTimePeriod] = useState("month");
    const [loading, setLoading] = useState(true);
    const [donations, setDonations] = useState([]);
    const [newDonation, setNewDonation] = useState(null);

    const initializeDonations = () => {
        return [
            {
                id: 1,
                amount: 500,
                donor: "John Smith",
                source: "Website",
                event: "Winter Relief",
                date: new Date().toISOString(),
                ngo: "Warm Hearts NGO",
                category: "Emergency",
            },
            {
                id: 2,
                amount: 1200,
                donor: "Sarah Johnson",
                source: "Mobile App",
                event: "Education Support",
                date: new Date(Date.now() - 86400000).toISOString(),
                ngo: "Education First",
                category: "Education",
            },
            {
                id: 3,
                amount: 750,
                donor: "Mike Chen",
                source: "Social Media",
                event: "Healthcare Drive",
                date: new Date(Date.now() - 172800000).toISOString(),
                ngo: "Health Care NGO",
                category: "Healthcare",
            },
            {
                id: 4,
                amount: 300,
                donor: "Emily Davis",
                source: "Website",
                event: "Food Program",
                date: new Date(Date.now() - 259200000).toISOString(),
                ngo: "Feed the Hungry",
                category: "Food",
            },
            {
                id: 5,
                amount: 2000,
                donor: "ABC Company",
                source: "Partnership",
                event: "Tech Education",
                date: new Date(Date.now() - 345600000).toISOString(),
                ngo: "Tech for All",
                category: "Technology",
            },
        ];
    };

    useEffect(() => {
        setDonations(initializeDonations());
        setLoading(false);

        const interval = setInterval(() => {
            const donors = [
                "Anonymous Donor",
                "Jane Wilson",
                "Bob Taylor",
                "Lisa Chen",
                "David Kim",
                "Maria Lopez",
            ];
            const sources = ["Website", "Mobile App", "Social Media", "Email"];
            const events = [
                "Emergency Relief",
                "Education Fund",
                "Health Care",
                "Food Support",
                "Community Help",
            ];
            const ngos = [
                "Local NGO",
                "Care Foundation",
                "Help Center",
                "Community Aid",
                "Support Network",
            ];
            const categories = [
                "Emergency",
                "Education",
                "Healthcare",
                "Food",
                "Community",
            ];

            const randomDonation = {
                id: Date.now(),
                amount: Math.floor(Math.random() * 1000) + 50,
                donor: donors[Math.floor(Math.random() * donors.length)],
                source: sources[Math.floor(Math.random() * sources.length)],
                event: events[Math.floor(Math.random() * events.length)],
                date: new Date().toISOString(),
                ngo: ngos[Math.floor(Math.random() * ngos.length)],
                category:
                    categories[Math.floor(Math.random() * categories.length)],
            };

            setDonations((prev) => [randomDonation, ...prev]);
            setNewDonation(randomDonation);
            setTimeout(() => setNewDonation(null), 3000);
        }, 10000);

        return () => clearInterval(interval);
    }, []);

    const stats = useMemo(() => {
        const totalDonations = donations.length;
        const totalAmount = donations.reduce(
            (sum, donation) => sum + donation.amount,
            0
        );
        const avgDonation =
            totalDonations > 0 ? Math.round(totalAmount / totalDonations) : 0;

        const sources = {};
        donations.forEach((donation) => {
            if (!sources[donation.source]) {
                sources[donation.source] = { count: 0, amount: 0 };
            }
            sources[donation.source].count += 1;
            sources[donation.source].amount += donation.amount;
        });

        const donationSources = Object.entries(sources)
            .map(([source, data]) => ({
                source,
                count: data.count,
                amount: data.amount,
                avgAmount: Math.round(data.amount / data.count),
                percentage:
                    totalDonations > 0
                        ? Math.round((data.count / totalDonations) * 100)
                        : 0,
            }))
            .sort((a, b) => b.amount - a.amount)
            .slice(0, 5);

        const events = {};
        donations.forEach((donation) => {
            if (!events[donation.event]) {
                events[donation.event] = {
                    count: 0,
                    amount: 0,
                    ngo: donation.ngo,
                    category: donation.category,
                };
            }
            events[donation.event].count += 1;
            events[donation.event].amount += donation.amount;
        });

        const topEvents = Object.entries(events)
            .map(([event, data]) => ({
                event,
                count: data.count,
                amount: data.amount,
                avgDonation: Math.round(data.amount / data.count),
                ngo: data.ngo,
                category: data.category,
            }))
            .sort((a, b) => b.amount - a.amount)
            .slice(0, 6);

        const donors = {};
        donations.forEach((donation) => {
            if (!donors[donation.donor]) {
                donors[donation.donor] = { count: 0, amount: 0 };
            }
            donors[donation.donor].count += 1;
            donors[donation.donor].amount += donation.amount;
        });

        const topDonors = Object.entries(donors)
            .map(([donor, data]) => ({
                donor,
                count: data.count,
                amount: data.amount,
                avgDonation: Math.round(data.amount / data.count),
            }))
            .sort((a, b) => b.amount - a.amount)
            .slice(0, 5);

        const categories = {};
        donations.forEach((donation) => {
            if (!categories[donation.category]) {
                categories[donation.category] = { count: 0, amount: 0 };
            }
            categories[donation.category].count += 1;
            categories[donation.category].amount += donation.amount;
        });

        const categoryBreakdown = Object.entries(categories)
            .map(([category, data]) => ({
                category,
                count: data.count,
                amount: data.amount,
                percentage:
                    totalDonations > 0
                        ? Math.round((data.count / totalDonations) * 100)
                        : 0,
            }))
            .sort((a, b) => b.amount - a.amount);

        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        const recentDonations = donations
            .filter((donation) => new Date(donation.date) >= sevenDaysAgo)
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 10);

        const trendsMap = {};
        donations.forEach((donation) => {
            const week = new Date(donation.date).toISOString().slice(0, 10);
            if (!trendsMap[week]) {
                trendsMap[week] = { count: 0, amount: 0 };
            }
            trendsMap[week].count += 1;
            trendsMap[week].amount += donation.amount;
        });

        const donationTrends = Object.entries(trendsMap)
            .map(([week, data]) => ({
                week,
                count: data.count,
                amount: data.amount,
                avgDonation: Math.round(data.amount / data.count),
            }))
            .sort((a, b) => new Date(a.week) - new Date(b.week));

        return {
            totalDonations,
            totalAmount,
            avgDonation,
            donationSources,
            topEvents,
            topDonors,
            categoryBreakdown,
            recentDonations,
            donationTrends,
        };
    }, [donations]);

    if (loading) {
        return <div className="loading">Loading donations...</div>;
    }

    return (
        <div className="donations-page">
            {newDonation && (
                <div className="donation-notification">
                    New donation! ${newDonation.amount} from {newDonation.donor}
                </div>
            )}

            <div className="donations-header">
                <h1>Donation Dashboard</h1>
                <p>Track donation sources, events, and giving patterns</p>
                <div className="time-filter">
                    <label>View:</label>
                    <select
                        value={timePeriod}
                        onChange={(e) => setTimePeriod(e.target.value)}
                    >
                        <option value="week">This Week</option>
                        <option value="month">This Month</option>
                        <option value="all">All Time</option>
                    </select>
                </div>
            </div>

            <div className="metrics-overview">
                <div className="metric-card">
                    <h3>Total Donations</h3>
                    <span className="metric-value">{stats.totalDonations}</span>
                </div>
                <div className="metric-card">
                    <h3>Total Raised</h3>
                    <span className="metric-value">
                        ${stats.totalAmount.toLocaleString()}
                    </span>
                </div>
                <div className="metric-card">
                    <h3>Average Gift</h3>
                    <span className="metric-value">${stats.avgDonation}</span>
                </div>
                <div className="metric-card">
                    <h3>Active Now</h3>
                    <span className="metric-value live-count">
                        {Math.floor(Math.random() * 5) + 1}
                    </span>
                </div>
            </div>

            <div className="insight-section">
                <h2>Where Donations Come From</h2>
                <div className="sources-grid">
                    {stats.donationSources.map((source, index) => (
                        <div key={index} className="source-card">
                            <h4>{source.source}</h4>
                            <div className="source-stats">
                                <p>
                                    <strong>
                                        ${source.amount.toLocaleString()}
                                    </strong>{" "}
                                    total
                                </p>
                                <p>
                                    <strong>{source.count}</strong> donations
                                </p>
                                <p>
                                    <strong>${source.avgAmount}</strong> average
                                </p>
                                <p>
                                    <strong>{source.percentage}%</strong> of
                                    total
                                </p>
                            </div>
                            <div className="source-bar">
                                <div
                                    className="source-fill"
                                    style={{ width: `${source.percentage}%` }}
                                ></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="insight-section">
                <h2>Most Successful Events</h2>
                <div className="events-table">
                    <div className="table-header">
                        <span>Event</span>
                        <span>Total Raised</span>
                        <span>Donations</span>
                        <span>Avg Amount</span>
                        <span>Category</span>
                        <span>NGO</span>
                    </div>
                    {stats.topEvents.map((event, index) => (
                        <div key={index} className="table-row">
                            <span className="event-name">{event.event}</span>
                            <span className="total-amount">
                                ${event.amount.toLocaleString()}
                            </span>
                            <span className="donation-count">
                                {event.count}
                            </span>
                            <span className="avg-amount">
                                ${event.avgDonation}
                            </span>
                            <span className="category-badge">
                                {event.category}
                            </span>
                            <span className="ngo-name">{event.ngo}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="insight-section">
                <h2>Recent Donations</h2>
                <div className="recent-donations">
                    {stats.recentDonations.map((donation) => (
                        <div key={donation.id} className="donation-item">
                            <div className="donation-info">
                                <span className="donor-name">
                                    {donation.donor}
                                </span>
                                <span className="donation-details">
                                    {donation.event} • {donation.source}
                                </span>
                            </div>
                            <div className="donation-meta">
                                <span className="amount">
                                    ${donation.amount}
                                </span>
                                <span className="time">
                                    {new Date(
                                        donation.date
                                    ).toLocaleTimeString()}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="insight-section">
                <h2>Top Donors</h2>
                <div className="donors-grid">
                    {stats.topDonors.map((donor, index) => (
                        <div key={index} className="donor-card">
                            <div className="donor-rank">#{index + 1}</div>
                            <h4>{donor.donor}</h4>
                            <div className="donor-stats">
                                <p>
                                    <strong>
                                        ${donor.amount.toLocaleString()}
                                    </strong>{" "}
                                    total
                                </p>
                                <p>
                                    <strong>{donor.count}</strong> donations
                                </p>
                                <p>
                                    <strong>${donor.avgDonation}</strong>{" "}
                                    average
                                </p>
                            </div>
                            <div className="donor-bar">
                                <div
                                    className="donor-fill"
                                    style={{
                                        width: `${
                                            (donor.amount /
                                                stats.topDonors[0].amount) *
                                            100
                                        }%`,
                                    }}
                                ></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="insight-section">
                <h2>Donations by Category</h2>
                <div className="category-breakdown">
                    {stats.categoryBreakdown.map((category, index) => (
                        <div key={index} className="category-item">
                            <div className="category-info">
                                <span className="category-name">
                                    {category.category}
                                </span>
                                <span className="category-amount">
                                    ${category.amount.toLocaleString()}
                                </span>
                                <span className="category-percentage">
                                    {category.percentage}%
                                </span>
                                <span className="category-count">
                                    {category.count} donations
                                </span>
                            </div>
                            <div className="category-bar">
                                <div
                                    className="category-fill"
                                    style={{ width: `${category.percentage}%` }}
                                ></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Donations;
