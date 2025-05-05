"use client"



import { useState, useEffect, useCallback } from 'react';
import { ToastContainer, toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';
import debounce from 'lodash.debounce';
import EstimatorCombobox from '@/components/EstimatorCombobox';
import ComboBoxComponentCommittees from '@/components/ComboBoxCommitteesComponent';


export default function Home() {


   // Generate years from 2020 to current year + 1 (you can adjust the range)
   const currentYear = new Date().getFullYear();
   const years = Array.from({ length: currentYear - 2019 }, (_, i) => 2020 + i);
 
   const orderTypeOptions = [
     { value: "محلية", label: "محلية" },
     { value: "محلية-مباشرة", label: "محلية-مباشرة" },
     { value: "محلية-مخزنية", label: "محلية-مخزنية" },
     { value: "خارجية-عامة", label: "خارجية-عامة" },
     { value: "خارجية-احتكارية", label: "خارجية-احتكارية" }
   ];
 
   const orderStatusOptions = [
     { value: "قيد الانجاز", label: "قيد الانجاز" },
     { value: "منجز", label: "منجز" },
     { value: "الغيت", label: "الغيت" }
   ];
 
   const currencyOptions = [
     { value: "دولار امريكي", label: "دولار امريكي (USD)" },
     { value: "اليورو", label: "اليورو (EUR)" },
     { value: "دينار عراقي", label: "دينار عراقي" }
   ];
 
   const [formData, setFormData] = useState({
     orderNo: '',
     orderYear: currentYear.toString(),
     orderDate: '',
     materialName: '',
     priceRequestedDestination: '',
     currencyType: 'دينار عراقي',
     finalPrice: '',
     orderType: '',
     coID: '',
     deID: '',
     estimatorID: '',
     procedureID: '',
     orderStatus: '',
     notes: '',
     achievedOrderDate: '',
     checkOrderLink: '',
     userID: ''
   });


   const payload = {
    ...formData,
    coID: parseInt(formData.coID),
    deID: parseInt(formData.deID),
    estimatorID: parseInt(formData.estimatorID),
    procedureID: parseInt(formData.procedureID),
    userID: parseInt(formData.userID),
    checkOrderLink: formData.checkOrderLink === "true", // ✅ FIXED HERE
    orderDate: convertToISO(formData.orderDate),
    achievedOrderDate: formData.achievedOrderDate
      ? convertToISO(formData.achievedOrderDate)
      : null,
  };


  function convertToISO(dateStr: string): string {
    const [day, month, year] = dateStr.split("-");
    return `${year}-${month}-${day}`;
  }
  
  
  
 
   const [errors, setErrors] = useState({ orderNo: '' });
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [submitMessage, setSubmitMessage] = useState('');

   const [selectedCommittee, setSelectedCommittee] = useState<string | undefined>(undefined);
   const [selectedDepartment, setSelectedDepartment] = useState<string | undefined>(undefined);

   const [estimators, setEstimators] = useState<{ estimatorID: number; estimatorName: string }[]>([]);

 
    // 🟨 Debounced real-time check
  const checkOrderExists = useCallback(
    debounce(async (orderNo: string, orderYear: string) => {
      try {
        const res = await fetch(
          `http://127.0.0.1:8000/api/orders/check-order-exists?orderNo=${orderNo}&orderYear=${orderYear}`
        );
        const data = await res.json();
        if (data.exists) {
          toast.warning(`الطلبية برقم ${orderNo} موجودة في سنة ${orderYear}`);
        }
      } catch (error) {
        console.error('Error checking order existence', error);
      }
    }, 500),
    []
  );

  useEffect(() => {
    if (formData.orderNo && /^\d+$/.test(formData.orderNo)) {
      checkOrderExists(formData.orderNo, formData.orderYear);
    }
  }, [formData.orderNo, formData.orderYear, checkOrderExists]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;

    if (id === 'orderNo') {
      if (value === '' || /^\d+$/.test(value)) {
        setErrors(prev => ({ ...prev, orderNo: '' }));
        setFormData(prev => ({ ...prev, [id]: value }));
      } else {
        setErrors(prev => ({ ...prev, orderNo: 'الرجاء إدخال أرقام فقط' }));
      }
    } else {
      setFormData(prev => ({ ...prev, [id]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    console.log(formData)
    try {
      const res = await fetch("http://localhost:8000/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      
      if (!res.ok) {
        const errorText = await res.text(); // show actual backend error
        console.error("Backend error:", errorText);
        throw new Error("حدث خطأ");
      }
      

      if (!res.ok) throw new Error('حدث خطأ');

      const data = await res.json();
      console.log('Submitted:', data);
      setSubmitMessage('نجاح: تم إرسال الطلبية');
      toast.success('تم إرسال الطلبية بنجاح');
    } catch (err) {
      console.error(err);
      setSubmitMessage('فشل: حدث خطأ أثناء الإرسال');
      toast.error('فشل في إرسال الطلبية');
    } finally {
      setIsSubmitting(false);
    }
  };


  useEffect(() => {
    const fetchEstimators = async () => {
      try {
        const res = await fetch('http://127.0.0.1:8000/api/estimators'); // Replace with your actual endpoint
        const data = await res.json();
        setEstimators(data);
      } catch (err) {
        console.error('Failed to fetch estimators:', err);
      }
    };

    fetchEstimators();
  }, []);



  return (
    <div className="flex flex-col  items-center justify-center p-4 sm:p-8 font-[family-name:var(--font-geist-sans)]" >

      {/* Toast container */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={true}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
   <label htmlFor="orderYear" className="text-2xl font-medium  text-gray-700 ">صفحة اضافة الطلبيات </label>
   <div className="w-full max-w-6xl mx-auto   ">
   
    <form onSubmit={handleSubmit} className="grid grid-cols-1  sm:grid-cols-2 md:grid-cols-3 gap-2 p-3 bg-white rounded-lg shadow-lg">

    <div>
        <label htmlFor="orderNo" className="block font-bold text-gray-700">
          رقم الطلبية
        </label>
        <input
          id="orderNo"
          type="text"
          value={formData.orderNo}
          onChange={handleChange}
          className={`w-full p-2 border ${errors.orderNo ? 'border-red-500' : 'border-gray-300'} rounded`}
        />
        {errors.orderNo && <p className="text-red-600 text-sm">{errors.orderNo}</p>}
      </div>

    {/* <div className="flex flex-col space-y-1">
        <label htmlFor="orderNo" className="text-lg font-extrabold text-gray-700">رقم الطلبية</label>
        <input 
          type="text" 
          id="orderNo" 
          className={`p-2 border ${errors.orderNo ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500`} 
          value={formData.orderNo} 
          onChange={handleChange} 
        />
        {errors.orderNo && (
          <p className="text-red-500 text-sm mt-1">{errors.orderNo}</p>
        )}
      </div> */}
      <div className="flex flex-col space-y-1">
        <label htmlFor="orderYear" className="text-lg font-extrabold text-gray-700">السنة</label>
        <select
          id="orderYear"
          className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          value={formData.orderYear}
          onChange={handleChange}
        >
          {years.map(year => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>
    <div className="flex flex-col space-y-1">
      <label htmlFor="orderDate" className="text-lg font-extrabold text-gray-700">تاريخ الطلبية</label>
      <input type="text" id="orderDate" className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" value={formData.orderDate} 
    onChange={handleChange}  />
    </div>
    <div className="flex flex-col">
      <label htmlFor="materialName" className="mb-1">اسم المادة</label>
      <input type="text" id="materialName" className="p-2 border rounded" value={formData.materialName} 
    onChange={handleChange} />
    </div>
    {/* Add more fields as needed */}
    <div className="flex flex-col">
      <label htmlFor="priceRequestedDestination" className="mb-1">سعر الجهة الطالبة</label>
      <input type="text" id="priceRequestedDestination" className="p-2 border rounded" value={formData.priceRequestedDestination} 
    onChange={handleChange} />
    </div>
    <div className="flex flex-col space-y-1">
        <label htmlFor="currencyType" className="text-lg font-extrabold text-gray-700">العملة</label>
        <select
          id="currencyType"
          className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          value={formData.currencyType}
          onChange={handleChange}
        >
          <option value="" disabled>اختر العملة</option>
          {currencyOptions.map((currency) => (
            <option key={currency.value} value={currency.value}>
              {currency.label}
            </option>
          ))}
        </select>
      </div>
    <div className="flex flex-col">
      <label htmlFor="finalPrice" className="mb-1">السعر النهائي</label>
      <input type="text" id="finalPrice" className="p-2 border rounded" value={formData.finalPrice} 
    onChange={handleChange} />
    </div>
    <div className="flex flex-col space-y-1">
  <label htmlFor="orderType" className="text-lg font-extrabold text-gray-700">نوع الطلبية</label>
  <select
    id="orderType"
    className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
    value={formData.orderType}
    onChange={handleChange}
  >
    <option value="" disabled>اختر نوع الطلبية</option>
    {orderTypeOptions.map((type) => (
      <option key={type.value} value={type.value}>
        {type.label}
      </option>
    ))}
  </select>
</div>


<div className="space-y-4 flex flex-col">
<label className="font-extrabold text-lg mb-1">الهيأة</label>
     
      <ComboBoxComponentCommittees
        valueType={selectedCommittee}
        onChange={(value) => {
          setSelectedCommittee(value);
          setSelectedDepartment(undefined); // Reset department selection
        }}
        fetchUrl="http://127.0.0.1:8000/api/committees"
      />

    </div>

    
        
        
        
      


    <div className="flex flex-col">
      <label htmlFor="deID" className="mb-1">القسم</label>
      <input type="text" id="deID" className="p-2 border rounded" value={formData.deID} 
    onChange={handleChange} />
    </div>

    <EstimatorCombobox
  value={formData.estimatorID ? Number(formData.estimatorID) : null}
  onChange={(val) => setFormData(prev => ({ ...prev, estimatorID: String(val) }))}

/>


    <div className="flex flex-col">
      <label htmlFor="procedureID" className="mb-1">الاجراء</label>
      <input type="text" id="procedureID" className="p-2 border rounded"  value={formData.procedureID} 
    onChange={handleChange}  />
    </div>



    <div className="flex flex-col space-y-1">
  <label htmlFor="orderStatus" className="text-lg font-extrabold text-gray-700">حالة الطلبية</label>
  <select
    id="orderStatus"
    className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
    value={formData.orderStatus}
    onChange={handleChange}
  >
    <option value="" disabled>اختر حالة الطلبية</option>
    {orderStatusOptions.map((status) => (
      <option key={status.value} value={status.value}>
        {status.label}
      </option>
    ))}
  </select>
</div>



    <div className="flex flex-col">
      <label htmlFor="userID" className="mb-1">userID</label>
      <input type="text" id="userID" className="p-2 border rounded"  value={formData.userID} 
    onChange={handleChange}  />
    </div>

    <div className="flex flex-col">
      <label htmlFor="notes" className="mb-1">الملاحظات</label>
      <input type="text" id="notes" className="p-2 border rounded"  value={formData.notes} 
    onChange={handleChange} />
    </div>

    <div className="flex flex-col">
      <label htmlFor="achievedOrderDate" className="mb-1">تاريخ الانجاز</label>
      <input type="text" id="achievedOrderDate" className="p-2 border rounded"  value={formData.achievedOrderDate} 
    onChange={handleChange} />
    </div>

    
    <div className="flex flex-col">
      <label htmlFor="checkOrderLink" className="mb-1">هل يوجد ارتباط</label>
      <input type="text" id="checkOrderLink" className="p-2 border rounded"  value={formData.checkOrderLink} 
    onChange={handleChange} />
    </div>

    <div className="col-span-full flex flex-col items-center mt-6 space-y-4">
    <p>Selected Committee ID: {selectedCommittee}</p>
    <p>Selected Department ID: {selectedDepartment}</p>
  <button 
    type="submit" 
    className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed min-w-[150px]"
    disabled={isSubmitting}
  >
    {isSubmitting ? 'جاري الإرسال...' : 'إرسال البيانات'}
    
  </button>

  
  
  {submitMessage && (
    <p className={`text-sm text-center ${submitMessage.includes('نجاح') ? 'text-green-600' : 'text-red-600'}`}>
      {submitMessage}
    </p>
  )}
</div>
  </form>
  </div>
  </div>
  );
}
