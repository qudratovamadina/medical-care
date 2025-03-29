import { useEffect, useState } from "react";
import { Card, Typography } from "@material-tailwind/react";
import { getLatestPaymentsByDoctorIdAPI } from "../api/doctor";
import { getLatestPaymentsByPatientIdAPI } from "../api/patient";

const TABLE_HEAD = ["Customer", "Amount", "Status", "Payment Method"];

export function TransactionsTable({ userId, role }) {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    const fetchPayments = async () => {
      if (!userId || !role) return;

      try {
        const latestPayments =
          role === "doctor"
            ? await getLatestPaymentsByDoctorIdAPI(userId)
            : await getLatestPaymentsByPatientIdAPI(userId);

        setPayments(latestPayments);
      } catch (error) {
        console.error("Error fetching payments:", error);
      }
    };

    fetchPayments();
  }, [userId, role]);

  return (
    <Card className="h-full w-full shadow-none">
      <table className="h-fit w-full min-w-max table-auto text-left">
        <thead className="bg-[#f2f2f2]">
          <tr>
            {TABLE_HEAD.map((head) => (
              <th key={head} className="p-4">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-bold leading-none"
                >
                  {head}
                </Typography>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {payments.length > 0 ? (
            payments.map((payment, index) => (
              <PaymentRow key={payment.id} payment={payment} index={index} />
            ))
          ) : (
            <tr>
              <td colSpan={TABLE_HEAD.length} className="p-4 text-center">
                <Typography variant="small" color="blue-gray">
                  No transactions found.
                </Typography>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </Card>
  );
}

const PaymentRow = ({ payment, index }) => {
  const { name, amount, status, payment_method } = payment;

  return (
    <tr>
      <td className="p-4">
        <Typography variant="small" className="font-normal text-gray-600">
          {name}
        </Typography>
      </td>
      <td className="p-4">
        <Typography variant="small" className="font-normal text-gray-600">
          ${amount}
        </Typography>
      </td>
      <td className="p-4">
        <Typography variant="small" className="font-normal text-gray-600">
          {status}
        </Typography>
      </td>
      <td className="p-4">
        <Typography variant="small" className="font-normal text-gray-600">
          {payment_method}
        </Typography>
      </td>
    </tr>
  );
};
