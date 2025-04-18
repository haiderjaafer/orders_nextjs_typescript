"use client"
import Image from "next/image";
import { useState } from 'react';


export default function Home() {

  const [formData, setFormData] = useState({
    orderNo: '',
    orderYear: '',
    orderDate: '',
    materialName: '',
    priceRequestedDestination: '',
    currencyType: '',
    finalPrice: '',
    orderType: '',
    coID: '',
    deID: '',
    estimatorID: '',
    procedureID: '',
    orderStatus:'',
    notes: '',
    achievedOrderDate:'',
    
    checkOrderLink:'',
    userID:''

  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting data:", formData);
  
    try {
      const response = await fetch('http://127.0.0.1:8000/api/orders/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        credentials: 'include', // Only if using cookies
      });
  
      if (!response.ok) throw new Error('Request failed');
  
      const data = await response.json();
      console.log('Success:', data);
      setSubmitMessage('نجاح: الطلبية تم إرسالها');
    } catch (error) {
      console.error('Error:', error);
      setSubmitMessage('فشل: حدث خطأ أثناء الإرسال');
    }
  };
  


  return (
    <div className="flex flex-col  items-center justify-center p-4 sm:p-8 font-[family-name:var(--font-geist-sans)]" >
   <label htmlFor="orderYear" className="text-2xl font-medium  text-gray-700 ">صفحة اضافة الطلبيات </label>
   <div className="w-full max-w-6xl mx-auto   ">
   
    <form onSubmit={handleSubmit} className="grid grid-cols-1  sm:grid-cols-2 md:grid-cols-3 gap-2 p-3 bg-white rounded-lg shadow-lg">

    <div className="flex flex-col space-y-1">
      <label htmlFor="orderNo" className="text-lg font-extrabold text-gray-700">رقم الطلبية</label>
      <input type="text" id="orderNo" className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" value={formData.orderNo} 
    onChange={handleChange} />
    </div>
    <div className="flex flex-col space-y-1">
      <label htmlFor="orderYear" className="text-lg font-extrabold text-gray-700">السنة</label>
      <input type="number" id="orderYear" className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" value={formData.orderYear} 
    onChange={handleChange}  />
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
    <div className="flex flex-col">
      <label htmlFor="currencyType" className="mb-1">العملة</label>
      <input type="text" id="currencyType" className="p-2 border rounded" value={formData.currencyType} 
    onChange={handleChange} />
    </div>
    <div className="flex flex-col">
      <label htmlFor="finalPrice" className="mb-1">السعر النهائي</label>
      <input type="text" id="finalPrice" className="p-2 border rounded" value={formData.finalPrice} 
    onChange={handleChange} />
    </div>
    <div className="flex flex-col">
      <label htmlFor="orderType" className="mb-1">نوع الطلبية</label>
      <input type="text" id="orderType" className="p-2 border rounded" value={formData.orderType} 
    onChange={handleChange} />
    </div>
    <div className="flex flex-col">
      <label htmlFor="coID" className="mb-1">الهيأة</label>
      <input type="text" id="coID" className="p-2 border rounded" value={formData.coID} 
    onChange={handleChange}/>
    </div>
    <div className="flex flex-col">
      <label htmlFor="deID" className="mb-1">القسم</label>
      <input type="text" id="deID" className="p-2 border rounded" value={formData.deID} 
    onChange={handleChange} />
    </div>

    <div className="flex flex-col">
      <label htmlFor="estimatorID" className="mb-1">اسم المخمن</label>
      <input type="text" id="estimatorID" className="p-2 border rounded" value={formData.estimatorID} 
    onChange={handleChange} />
    </div>

    <div className="flex flex-col">
      <label htmlFor="procedureID" className="mb-1">الاجراء</label>
      <input type="text" id="procedureID" className="p-2 border rounded"  value={formData.procedureID} 
    onChange={handleChange}  />
    </div>

    <div className="flex flex-col">
      <label htmlFor="orderStatus" className="mb-1">حالة الطلبية</label>
      <input type="text" id="orderStatus" className="p-2 border rounded"  value={formData.orderStatus} 
    onChange={handleChange}  />
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
