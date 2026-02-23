'use client';

import { useState } from 'react';
import { calculateEMI, formatPrice } from '@/lib/utils';
import { Calculator, IndianRupee, Percent, Calendar, PieChart, TrendingUp, ArrowRight } from 'lucide-react';
import styles from './page.module.css';

export default function CalculatorPage() {
    const [form, setForm] = useState({
        principal: 5000000,
        rate: 8.5,
        tenure: 20,
    });

    const update = (key, val) => setForm(prev => ({ ...prev, [key]: parseFloat(val) || 0 }));

    const emi = calculateEMI(form.principal, form.rate, form.tenure);
    const totalAmount = emi * form.tenure * 12;
    const totalInterest = totalAmount - form.principal;
    const principalPercent = form.principal > 0 ? Math.round((form.principal / totalAmount) * 100) : 0;
    const interestPercent = 100 - principalPercent;

    return (
        <div className={styles.calcPage}>
            <div className="container">
                <div className={styles.pageHeader}>
                    <h1 className={styles.pageTitle}>
                        <Calculator size={28} className="gradient-text" />
                        EMI <span className="gradient-text">Calculator</span>
                    </h1>
                    <p className={styles.pageSubtitle}>
                        Calculate your Equated Monthly Installment for home loans
                    </p>
                </div>

                <div className={styles.calcGrid}>
                    {/* Input Form */}
                    <div className={styles.calcCard}>
                        <h3 className={styles.calcCardTitle}>Loan Details</h3>

                        <div className={styles.inputGroup}>
                            <div className={styles.inputHeader}>
                                <label className={styles.inputLabel}>
                                    <IndianRupee size={14} /> Loan Amount
                                </label>
                                <span className={styles.inputValue}>{formatPrice(form.principal)}</span>
                            </div>
                            <input
                                type="range"
                                min="100000" max="100000000" step="100000"
                                value={form.principal}
                                onChange={(e) => update('principal', e.target.value)}
                                className={styles.rangeInput}
                            />
                            <div className={styles.rangeLabels}>
                                <span>₹1L</span>
                                <span>₹10Cr</span>
                            </div>
                        </div>

                        <div className={styles.inputGroup}>
                            <div className={styles.inputHeader}>
                                <label className={styles.inputLabel}>
                                    <Percent size={14} /> Interest Rate (%)
                                </label>
                                <span className={styles.inputValue}>{form.rate}%</span>
                            </div>
                            <input
                                type="range"
                                min="4" max="20" step="0.1"
                                value={form.rate}
                                onChange={(e) => update('rate', e.target.value)}
                                className={styles.rangeInput}
                            />
                            <div className={styles.rangeLabels}>
                                <span>4%</span>
                                <span>20%</span>
                            </div>
                        </div>

                        <div className={styles.inputGroup}>
                            <div className={styles.inputHeader}>
                                <label className={styles.inputLabel}>
                                    <Calendar size={14} /> Loan Tenure (years)
                                </label>
                                <span className={styles.inputValue}>{form.tenure} years</span>
                            </div>
                            <input
                                type="range"
                                min="1" max="30" step="1"
                                value={form.tenure}
                                onChange={(e) => update('tenure', e.target.value)}
                                className={styles.rangeInput}
                            />
                            <div className={styles.rangeLabels}>
                                <span>1 yr</span>
                                <span>30 yrs</span>
                            </div>
                        </div>
                    </div>

                    {/* Results */}
                    <div className={styles.resultsCard}>
                        <div className={styles.emiDisplay}>
                            <span className={styles.emiLabel}>Monthly EMI</span>
                            <h2 className={styles.emiAmount}>{formatPrice(Math.round(emi))}</h2>
                        </div>

                        {/* Donut Chart */}
                        <div className={styles.chartContainer}>
                            <svg viewBox="0 0 200 200" className={styles.donutChart}>
                                <circle
                                    cx="100" cy="100" r="80"
                                    fill="none" stroke="var(--bg-tertiary)" strokeWidth="24"
                                />
                                <circle
                                    cx="100" cy="100" r="80"
                                    fill="none" stroke="var(--primary)" strokeWidth="24"
                                    strokeDasharray={`${principalPercent * 5.024} ${500 - principalPercent * 5.024}`}
                                    strokeDashoffset="126"
                                    strokeLinecap="round"
                                />
                                <circle
                                    cx="100" cy="100" r="80"
                                    fill="none" stroke="var(--accent)" strokeWidth="24"
                                    strokeDasharray={`${interestPercent * 5.024} ${500 - interestPercent * 5.024}`}
                                    strokeDashoffset={`${126 - principalPercent * 5.024}`}
                                    strokeLinecap="round"
                                />
                            </svg>
                            <div className={styles.chartCenter}>
                                <span className={styles.chartTotal}>{formatPrice(Math.round(totalAmount))}</span>
                                <span className={styles.chartLabel}>Total Amount</span>
                            </div>
                        </div>

                        <div className={styles.breakdown}>
                            <div className={styles.breakdownItem}>
                                <div className={styles.breakdownDot} style={{ background: 'var(--primary)' }} />
                                <div>
                                    <span className={styles.breakdownLabel}>Principal Amount</span>
                                    <strong>{formatPrice(form.principal)}</strong>
                                </div>
                            </div>
                            <div className={styles.breakdownItem}>
                                <div className={styles.breakdownDot} style={{ background: 'var(--accent)' }} />
                                <div>
                                    <span className={styles.breakdownLabel}>Total Interest</span>
                                    <strong>{formatPrice(Math.round(totalInterest))}</strong>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
