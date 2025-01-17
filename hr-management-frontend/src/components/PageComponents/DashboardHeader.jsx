import React from "react";

export default function DashboardHeader({ title }) {
    return (
        <div className="dashboard-header mb-4 pl-2">
            <h1 className="text-2xl md:text-3xl font-bold text-blue-950">{title}</h1>
           
        </div>
    );
}
