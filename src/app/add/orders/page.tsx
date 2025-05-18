"use client"
import { useState, useEffect, useCallback } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import debounce from 'lodash.debounce';
import EstimatorCombobox from '@/components/EstimatorCombobox';
import { ComboBoxComponentCommittees } from '@/components/companyStructure/ComboBoxCommitteesComponent';
import ComboBoxComponentDepartment from '@/components/companyStructure/ComboBoxComponentDepartment';
import { DatePicker } from '@/components/ui/date-picker';
import { format } from 'date-fns';
import MaterialNameInput from '@/components/materialNameComponent/MaterialNameInput';
import { OrderFormData } from '@/types';
import NoteComponent from '@/components/notesDialog/NoteComponent';



export default function AddOrders() {

   // Generate years from 2020 to current year + 1 (you can adjust the range)
   const currentYear = new Date().getFullYear();
   const years = Array.from({ length: currentYear - 2019 }, (_, i) => 2020 + i);

   const [selectedCommittee, setSelectedCommittee] = useState<string | undefined>(undefined);
   const [selectedDepartment, setSelectedDepartment] = useState<string | undefined>(undefined);

   const [estimators, setEstimators] = useState<{ estimatorID: number; estimatorName: string }[]>([]);

   const [selectedDate, setSelectedDate] = useState<string | null>(null);

   const [selectedOrderDate, setSelectedOrderDate] = useState<string | null>(null);

   const [procedures, setProcedures] = useState<{ procedureID: number; procedureName: string }[]>([]);

 
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
 
const [formData, setFormData] = useState<OrderFormData>({
    orderNo: '',
    orderYear: currentYear.toString(),
    orderDate: selectedOrderDate ?? '',
    materialName: '',
    priceRequestedDestination: '',
    currencyType: 'دينار عراقي',
    finalPrice: '',
    orderType: '',
    coID: selectedCommittee ?? '',
    deID: selectedDepartment ?? '',
    estimatorID: '',
    procedureID: '',
    orderStatus: '',
    notes: '',
    achievedOrderDate: selectedDate ?? '',
    checkOrderLink: '',
    userID: '1',
  });

   console.log("formData" ,formData);


   const payload = {
    ...formData,
    coID: selectedCommittee ? parseInt(selectedCommittee) : null,
    deID: selectedDepartment ? parseInt(selectedDepartment) : null,
    estimatorID: parseInt(formData.estimatorID),
    procedureID: parseInt(formData.procedureID),
    //userID: parseInt(formData.userID ) ,
    userID:1,

    checkOrderLink: formData.checkOrderLink === "false",

 
  };
  

  


  function safeConvertToISO(dateStr: string): string {
    // Acceptable input: "DD-MM-YYYY"
    const parts = dateStr.split("-");
    if (parts.length !== 3) return dateStr;
  
    const [day, month, year] = parts;
    if (year.length !== 4 || isNaN(+day) || isNaN(+month) || isNaN(+year)) {
      return dateStr; // Don't change it; let backend validate
    }
  
    return `${year}-${month}-${day}`;
  }
  
  
  
  
 
   const [errors, setErrors] = useState({ orderNo: '' });
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [submitMessage, setSubmitMessage] = useState('');

  
 
    // 🟨 Debounced real-time check
  const checkOrderExists = useCallback(
    debounce(async (orderNo: string, orderYear: string) => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/orders/check-order-exists?orderNo=${orderNo}&orderYear=${orderYear}`
          
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
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/orders`, {
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
      // toast.error('فشل في إرسال الطلبية');
      toast.warning(`الطلبية برقم ${formData.orderNo} موجودة في سنة ${formData.orderYear}`);
    } finally {
      setIsSubmitting(false);
    }
  };


  useEffect(() => {
    const fetchEstimators = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/estimators`); 
        const data = await res.json();
        setEstimators(data);
      } catch (err) {
        console.error('Failed to fetch estimators:', err);
      }
    };

    fetchEstimators();
  }, []);

  

  const handleDateChangeOrderDate = (date: Date) => {
    const formattedDate = format(date, "yyyy-MM-dd");
    console.log("formattedDate", formattedDate);
    setFormData(prev => ({
      ...prev,
      orderDate: formattedDate
    }));
  };
  
  
  const handleDateChangeAchievedOrderDate = (date: Date) => {
    console.log("Selected date:", date);
    // You can set this date to state or use it as needed
    const formattedDate = format(date, "yyyy-MM-dd");

    setFormData(prev => ({
      ...prev,
      achievedOrderDate: formattedDate
    }));
  };


  

useEffect(() => {
  fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/procedures`)
    .then((res) => res.json())
    .then((data) => setProcedures(data))
    .catch((err) => console.error("Failed to fetch procedures:", err));
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


      <div className="flex flex-col">
      
      <label  htmlFor="orderDate" className="mb-1" >تأريخ الطلبية</label>
      <DatePicker onDateChange={handleDateChangeOrderDate}  />
      
      </div>


  

      <MaterialNameInput formData={formData} setFormData={setFormData} />


  

  
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
{/* <label className="font-extrabold text-lg mb-1">الهيأة</label> */}
     
<ComboBoxComponentCommittees
  valueType={selectedCommittee}
  onChange={(value) => {
    setSelectedCommittee(value);
    setSelectedDepartment(undefined); // reset department
    setFormData((prev) => ({
      ...prev,
      coID: value,
      deID: '', // clear department in formData as well
    }));
  }}
  fetchUrl={`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/committees`}
/>



    </div>

    
        
        
    <div className="space-y-4 flex flex-col">
<label className="font-extrabold text-lg mb-1">القسم</label>
   
      
<ComboBoxComponentDepartment
  value={formData.deID}
  onChange={(value) => {
    setSelectedDepartment(value);
    setFormData((prev) => ({
      ...prev,
      deID: value,
    }));
  }}
  fetchUrl={
    selectedCommittee
      ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/departments/by-committee/${selectedCommittee}`
      : undefined
  }
/>



</div>



    <EstimatorCombobox
  value={formData.estimatorID ? Number(formData.estimatorID) : null}
  onChange={(val) => setFormData(prev => ({ ...prev, estimatorID: String(val) }))}

/>



<div className="flex flex-col">
  <label htmlFor="procedureID" className="mb-1">الاجراء</label>
  <select
    id="procedureID"
    className="p-2 border rounded"
    value={formData.procedureID}
    onChange={(e) =>
      setFormData((prev) => ({ ...prev, procedureID: e.target.value }))
    }
  >
    <option value="">اختر إجراء</option>
    {procedures.map((proc) => (
      <option key={proc.procedureID} value={proc.procedureID}>
        {proc.procedureName}
      </option>
    ))}
  </select>
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



   

    <NoteComponent formData={formData} setFormData={setFormData} />


    <div className="flex flex-col">
      
      <label  htmlFor="achievedOrderDate" className="mb-1" >تأريخ الانجاز</label>
      <DatePicker onDateChange={handleDateChangeAchievedOrderDate}  />
     
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
