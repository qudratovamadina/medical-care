import { useState } from "react";
import {
  Card,
  CardBody,
  Input,
  Typography,
  Button,
} from "@material-tailwind/react";
import { ChatBubbleBottomCenterTextIcon } from "@heroicons/react/24/solid";

const presetResponses = [
  {
    keywords: ["help", "issue", "problem", "support"],
    response:
      "Hi there! Thanks for reaching out. Can you please tell me a bit more about your issue?",
  },
  {
    keywords: ["appointment", "book", "schedule"],
    response:
      "To book or manage your appointments, please go to the Appointments page from the dashboard.",
  },
];

const defaultResponse =
  "Thank you for your message. We'll connect you with an admin shortly if you need more assistance.";

export default function SupportChatWidget() {
  const [messages, setMessages] = useState([
    { from: "bot", text: "👋 Hello! Need help? Type your message below." },
  ]);
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const getBotResponse = (message) => {
    const lower = message.toLowerCase();
    for (let { keywords, response } of presetResponses) {
      if (keywords.some((k) => lower.includes(k))) {
        return response;
      }
    }
    return defaultResponse;
  };

  const sendMessage = () => {
    if (!input.trim()) return;
    const userMsg = { from: "user", text: input.trim() };
    const botMsg = { from: "bot", text: getBotResponse(input.trim()) };
    setMessages((prev) => [...prev, userMsg, botMsg]);
    setInput("");
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 z-50 rounded-full bg-blue-600 p-3 text-white shadow-lg hover:bg-blue-700"
      >
        <ChatBubbleBottomCenterTextIcon className="h-6 w-6" />
      </button>

      {isOpen && (
        <Card className="fixed bottom-20 right-4 z-50 w-full max-w-sm shadow-lg">
          <CardBody className="flex max-h-96 flex-col gap-3 overflow-y-auto p-4">
            <Typography variant="h6" color="blue-gray">
              💬 Support Chat
            </Typography>
            <div className="flex flex-col gap-2">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                    msg.from === "bot"
                      ? "self-start bg-blue-gray-50"
                      : "self-end bg-blue-500 text-white"
                  }`}
                >
                  {msg.text}
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2 pt-2">
              <Input
                label="Type a message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                className="flex-1"
              />
              <Button onClick={sendMessage} size="sm">
                Send
              </Button>
            </div>
          </CardBody>
        </Card>
      )}
    </>
  );
}