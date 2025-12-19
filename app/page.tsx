// app/registration/page.tsx
"use client";

import { useState, FormEvent, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { toast, Toaster } from 'react-hot-toast';
import Link from 'next/link';
import { 
  User, Mail, Phone, MapPin, Calendar, 
  BookOpen, Building, FileText, CreditCard,
  Shield, AlertCircle, CheckCircle
} from 'lucide-react';

interface FormData {
  fullName: string;
  email: string;
  phoneNumber: string;
  address: string;
  dateOfBirth: string;
  educationLevel: string;
  institution: string;
  examType: 'officer' | 'assistant' | 'specialist';
  paymentMethod: 'card' | 'bank' | 'mobile';
  termsAccepted: boolean;
  
  photo: File | null;
  idDocument: File | null;
}

const SINQE_REGISTRATION = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    phoneNumber: '',
    address: '',
    dateOfBirth: '',
    educationLevel: '',
    institution: '',
    examType: 'officer',
    paymentMethod: 'card',
    termsAccepted: false,
    photo: null,
    idDocument: null,
  });

  const educationLevels = [
    'High School',
    'Diploma',
    'Bachelor Degree',
    'Master Degree',
    'PhD'
  ];

  const examTypes = [
    { id: 'officer', label: 'Bank Officer', fee: 500 },
    { id: 'assistant', label: 'Bank Assistant', fee: 300 },
    { id: 'specialist', label: 'Specialist Officer', fee: 700 },
  ];

  const paymentMethods = [
    { id: 'card', label: 'Credit/Debit Card' },
    { id: 'bank', label: 'Bank Transfer' },
    { id: 'mobile', label: 'Mobile Banking' },
  ];

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>, field: keyof FormData) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, [field]: e.target.files![0] }));
    }
  };

  const validateStep = (stepNumber: number): boolean => {
    switch (stepNumber) {
      case 1:
        if (!formData.fullName || !formData.email || !formData.phoneNumber) {
          toast.error('Please fill in all required fields');
          return false;
        }
        if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
          toast.error('Please enter a valid email address');
          return false;
        }
        return true;
      
      case 2:
        if (!formData.dateOfBirth || !formData.educationLevel || !formData.institution) {
          toast.error('Please fill in all educational information');
          return false;
        }
        const age = new Date().getFullYear() - new Date(formData.dateOfBirth).getFullYear();
        if (age < 18) {
          toast.error('You must be at least 18 years old to register');
          return false;
        }
        return true;
      
      case 3:
        if (!formData.termsAccepted) {
          toast.error('You must accept the terms and conditions');
          return false;
        }
        return true;
      
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep(prev => Math.min(prev + 1, 4));
    }
  };

  const prevStep = () => {
    setStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!validateStep(step)) return;
    
    setLoading(true);
    
    try {
      // Create FormData for file upload
      const submitFormData = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value instanceof File) {
          submitFormData.append(key, value);
        } else {
          submitFormData.append(key, String(value));
        }
      });

      // API call to register
      const response = await fetch('/api/register-exam', {
        method: 'POST',
        body: submitFormData,
      });

      if (response.ok) {
        toast.success('Registration successful!');
        setTimeout(() => {
          router.push('/registration/success');
        }, 2000);
      } else {
        throw new Error('Registration failed');
      }
    } catch (error) {
      toast.error('Registration failed. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              <User className="w-5 h-5" />
              Personal Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  placeholder="Enter your full name"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    placeholder="example@domain.com"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    placeholder="+251 91 234 5678"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date of Birth *
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    required
                  />
                </div>
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address *
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    rows={3}
                    placeholder="Enter your complete address"
                    required
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Educational Background
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Highest Education Level *
                </label>
                <select
                  name="educationLevel"
                  value={formData.educationLevel}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  required
                >
                  <option value="">Select education level</option>
                  {educationLevels.map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Institution *
                </label>
                <div className="relative">
                  <Building className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="institution"
                    value={formData.institution}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    placeholder="University/College name"
                    required
                  />
                </div>
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-lg font-semibold text-gray-800 mb-4">
                  Exam Type Selection *
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {examTypes.map(exam => (
                    <label
                      key={exam.id}
                      className={`relative flex flex-col p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        formData.examType === exam.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="examType"
                        value={exam.id}
                        checked={formData.examType === exam.id}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <span className="font-semibold text-gray-800">{exam.label}</span>
                      <span className="text-sm text-gray-600 mt-1">Registration Fee: ETB {exam.fee}</span>
                      <span className="text-xs text-gray-500 mt-2">
                        {exam.id === 'officer' && 'For officer level positions'}
                        {exam.id === 'assistant' && 'For assistant level positions'}
                        {exam.id === 'specialist' && 'For specialist positions'}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-lg font-semibold text-gray-800 mb-4">
                  Required Documents
                </label>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Passport Size Photo *
                    </label>
                    <div className="flex items-center gap-4">
                      <div className="relative flex-1">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileChange(e, 'photo')}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                      </div>
                      {formData.photo && (
                        <span className="text-sm text-green-600 flex items-center gap-1">
                          <CheckCircle className="w-4 h-4" />
                          Selected
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Max size: 2MB, Format: JPG/PNG
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ID Document (PDF) *
                    </label>
                    <div className="flex items-center gap-4">
                      <div className="relative flex-1">
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={(e) => handleFileChange(e, 'idDocument')}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                      </div>
                      {formData.idDocument && (
                        <span className="text-sm text-green-600 flex items-center gap-1">
                          <CheckCircle className="w-4 h-4" />
                          Selected
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Max size: 5MB, Format: PDF/DOC
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Payment Information
            </h3>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2 text-blue-800 mb-2">
                <AlertCircle className="w-5 h-5" />
                <span className="font-semibold">Payment Details</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Selected Exam:</p>
                  <p className="font-semibold">
                    {examTypes.find(e => e.id === formData.examType)?.label}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Registration Fee:</p>
                  <p className="font-semibold text-lg text-blue-600">
                    ETB {examTypes.find(e => e.id === formData.examType)?.fee}
                  </p>
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-lg font-semibold text-gray-800 mb-4">
                Payment Method *
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {paymentMethods.map(method => (
                  <label
                    key={method.id}
                    className={`relative flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      formData.paymentMethod === method.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method.id}
                      checked={formData.paymentMethod === method.id}
                      onChange={handleChange}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="font-medium text-gray-800">{method.label}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div className="mt-8 p-4 border border-gray-200 rounded-lg">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="termsAccepted"
                  checked={formData.termsAccepted}
                  onChange={handleChange}
                  className="mt-1 w-4 h-4 text-blue-600 rounded"
                  required
                />
                <div>
                  <span className="font-medium text-gray-800">
                    I agree to the terms and conditions *
                  </span>
                  <p className="text-sm text-gray-600 mt-1">
                    By checking this box, I confirm that all information provided is accurate and complete. 
                    I understand that false information may lead to disqualification from the SINQE Bank Exam.
                  </p>
                  <Link 
                    href="/terms" 
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium inline-flex items-center gap-1 mt-2"
                  >
                    <FileText className="w-4 h-4" />
                    Read complete terms and conditions
                  </Link>
                </div>
              </label>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="text-center py-8">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <Shield className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              Review Your Registration
            </h3>
            <p className="text-gray-600 mb-8">
              Please review all information before submission
            </p>
            
            <div className="bg-gray-50 rounded-lg p-6 text-left mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">Personal Info</h4>
                  <p className="text-sm text-gray-600">{formData.fullName}</p>
                  <p className="text-sm text-gray-600">{formData.email}</p>
                  <p className="text-sm text-gray-600">{formData.phoneNumber}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">Education</h4>
                  <p className="text-sm text-gray-600">{formData.educationLevel}</p>
                  <p className="text-sm text-gray-600">{formData.institution}</p>
                </div>
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-700">Exam Type:</span>
                  <span className="font-medium">
                    {examTypes.find(e => e.id === formData.examType)?.label}
                  </span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="font-semibold text-gray-700">Payment Method:</span>
                  <span className="font-medium">
                    {paymentMethods.find(p => p.id === formData.paymentMethod)?.label}
                  </span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="font-semibold text-gray-700">Total Fee:</span>
                  <span className="font-bold text-lg text-blue-600">
                    ETB {examTypes.find(e => e.id === formData.examType)?.fee}
                  </span>
                </div>
              </div>
            </div>
            
            <p className="text-sm text-gray-500 mb-6">
              Click Submit to complete your registration. You will receive a confirmation email with further instructions.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-8 px-4">
      <Toaster position="top-right" />
      
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
              <Building className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">SINQE Bank Exam Registration</h1>
              <p className="text-gray-600">Secure your future with Ethiopia's leading bank</p>
            </div>
          </div>
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
            <Shield className="w-4 h-4" />
            Secure Registration Process
          </div>
        </header>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
          {/* Progress Bar */}
          <div className="px-8 pt-8">
            <div className="mb-8">
              <div className="flex justify-between mb-2">
                {[1, 2, 3, 4].map((stepNum) => (
                  <div
                    key={stepNum}
                    className={`flex flex-col items-center ${
                      stepNum <= step ? 'text-blue-600' : 'text-gray-400'
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center border-2 font-semibold ${
                        stepNum <= step
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'border-gray-300'
                      }`}
                    >
                      {stepNum}
                    </div>
                    <span className="text-xs mt-2 font-medium">
                      {stepNum === 1 && 'Personal'}
                      {stepNum === 2 && 'Education'}
                      {stepNum === 3 && 'Payment'}
                      {stepNum === 4 && 'Review'}
                    </span>
                  </div>
                ))}
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 transition-all duration-300"
                  style={{ width: `${((step - 1) / 3) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-8 pb-8">
            {renderStep()}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t">
              <div>
                {step > 1 && (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition"
                  >
                    Back
                  </button>
                )}
              </div>
              
              <div className="flex gap-4">
                {step < 4 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
                  >
                    Continue
                    <span className="ml-1">→</span>
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-8 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition flex items-center gap-2 disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        Submit Registration
                        <CheckCircle className="w-5 h-5" />
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </form>

          {/* Footer */}
          <div className="bg-gray-50 px-8 py-4 border-t">
            <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-600">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <Shield className="w-4 h-4" />
                  Secure SSL Encryption
                </span>
                <span className="hidden md:inline">•</span>
                <span>Your data is protected</span>
              </div>
              <div className="mt-2 md:mt-0">
                Need help?{' '}
                <Link href="/contact" className="text-blue-600 hover:text-blue-800 font-medium">
                  Contact Support
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-800">Exam Schedule</h3>
            </div>
            <p className="text-sm text-gray-600">Check exam dates and venues on our schedule page.</p>
          </div>
          
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-800">Preparation Materials</h3>
            </div>
            <p className="text-sm text-gray-600">Access study materials and sample questions.</p>
          </div>
          
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Phone className="w-5 h-5 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-800">Support Center</h3>
            </div>
            <p className="text-sm text-gray-600">24/7 support available for registration queries.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SINQE_REGISTRATION;