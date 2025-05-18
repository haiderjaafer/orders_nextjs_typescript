'use client';

import React, { useEffect, useState } from 'react';

interface Department {
  value: string;
  label: string;
}

interface DepartmentSelectProps {
  value: string;
  onChange: (selectedValue: string) => void;
  fetchUrl?: string; // Endpoint: /api/departments/by-committee/{id}
}

const ComboBoxComponentDepartment: React.FC<DepartmentSelectProps> = ({
  value,
  onChange,
  fetchUrl,
}) => {
  const [departments, setDepartments] = useState<Department[]>([]);

  useEffect(() => {
    const fetchDepartments = async () => {
      if (!fetchUrl) return;

      try {
        const response = await fetch(fetchUrl);
        const data = await response.json();

        const departmentsArray = Array.isArray(data)
          ? data
          : Array.isArray(data.departments)
          ? data.departments
          : [];

        const formattedDepartments = departmentsArray.map((dept: { deID: number; Dep: string }) => ({
          value: dept.deID.toString(),
          label: dept.Dep,
        }));

        setDepartments(formattedDepartments);
      } catch (error) {
        console.error('Error fetching departments:', error);
      }
    };

    fetchDepartments();
  }, [fetchUrl]);

  return (
    <div className="flex flex-col space-y-1">
      {/* <label htmlFor="department" className="text-lg font-extrabold text-gray-700">
        القسم
      </label> */}
      <select
        id="department"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        <option value="">اختر القسم</option>
        {departments.map((dept) => (
          <option key={dept.value} value={dept.value}>
            {dept.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ComboBoxComponentDepartment;
