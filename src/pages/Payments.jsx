import React, { useEffect, useState } from "react";
import { TopNavbar } from "../components/TopNavbar";
import { getPaymentsByDoctorIdAPI } from "../api/doctor";
import { getPaymentsByPatientIdAPI } from "../api/patient";
import { useAuth } from "../provider/AuthProvider";
import {
  Card,
  CardHeader,
  Typography,
  CardBody,
  Chip,
  CardFooter,
  Avatar,
} from "@material-tailwind/react";
import { patientIMG } from "../components/utils/constants";

const Payments = () => {
  const { user, role } = useAuth();
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response =
          role === "doctor"
            ? await getPaymentsByDoctorIdAPI(user.id)
            : await getPaymentsByPatientIdAPI(user.id);
        setPayments(response);
      } catch (error) {
        console.error("Error fetching payments:", error);
      }
    };

    fetchPayments();
  }, [user, role]);

  const totalAmount = payments.reduce(
    (sum, payment) => sum + Number(payment.amount),
    0,
  );

  const headers = [
    role === "doctor" ? "Patient" : "Doctor",
    "Amount",
    "Status",
    "Method",
  ];

  return (
    <div className="flex flex-col gap-4">
      <Typography variant="h4" color="blue-gray">
        {role === "doctor" ? "Payments Received" : "Payments Made"}
      </Typography>

      <SummaryCard
        totalAmount={totalAmount}
        paymentsCount={payments.length}
        role={role}
      />

      <TransactionTable headers={headers} payments={payments} role={role} />
    </div>
  );
};

const SummaryCard = ({ totalAmount, paymentsCount, role }) => (
  <Card className="p-4 shadow-md">
    <CardBody className="flex items-center justify-between">
      <Typography variant="h6" color="green">
        Total {role === "doctor" ? "Collected" : "Spent"}: $
        {totalAmount.toFixed(2)}
      </Typography>
      <Typography variant="small" color="blue-gray">
        Total Transactions: {paymentsCount}
      </Typography>
    </CardBody>
  </Card>
);

const TransactionTable = ({ headers, payments, role }) => (
  <Card className="space-y-4 shadow-md">
    <CardHeader floated={false} shadow={false} className="bg-gray-100 p-4">
      <Typography variant="h6" color="blue-gray">
        Payment Transactions
      </Typography>
    </CardHeader>
    <CardBody className="p-0">
      <table className="w-full table-auto">
        <thead>
          <tr className="bg-gray-100">
            {headers.map((header) => (
              <th key={header} className="p-2 text-left font-semibold">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {payments.length > 0 ? (
            payments.map((payment) => (
              <PaymentRow key={payment.id} payment={payment} />
            ))
          ) : (
            <tr>
              <td colSpan={headers.length} className="p-4 text-center">
                No payments found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </CardBody>
    <CardFooter className="p-4">
      <Typography variant="small" color="blue-gray">
        Showing {payments.length} payments
      </Typography>
    </CardFooter>
  </Card>
);

const PaymentRow = ({ payment }) => {
  const { name, amount, status, payment_method, profile_img } = payment;

  return (
    <tr>
      <td className="border-b border-blue-gray-50 p-4">
        <div className="flex items-center gap-3">
          <Avatar src={profile_img || patientIMG} alt={name} size="sm" />
          <Typography variant="small" color="blue-gray" className="font-normal">
            {name}
          </Typography>
        </div>
      </td>
      <td className="border-b border-blue-gray-50 p-4">${amount}</td>
      <td className="border-b border-blue-gray-50 p-4">
        <Chip
          variant="ghost"
          size="sm"
          value={status}
          color={status === "paid" ? "green" : "red"}
          className="w-fit"
        />
      </td>
      <td className="border-b border-blue-gray-50 p-4">{payment_method}</td>
    </tr>
  );
};

export default Payments;
