import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useContext, useEffect, useMemo, useState } from "react";
import React from "react";
import { FaCheckCircle } from "react-icons/fa";
import { MovieContext } from "../../Context/MovieContext";
import { userContext } from "../../Context/UserContext";
import api from "../../lib/api";

export default function PaymentModal({ isOpen, price, setIsOpen, state }) {
  const { movie } = useContext(MovieContext);
  const { currentUser, isAuthenticated } = useContext(userContext);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("error");
  const [pendingOrder, setPendingOrder] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setMessage("");
      setMessageType("error");
      setIsSubmitting(false);
      setPendingOrder(null);
    }
  }, [isOpen, state]);

  const closeModal = () => {
    if (!isSubmitting) {
      setIsOpen(false);
    }
  };

  const moviePayload = useMemo(
    () => ({
      id: movie.id,
      title: movie.original_title || movie.title || "Movie",
      posterPath: movie.poster_path || "",
      backdropPath: movie.backdrop_path || "",
    }),
    [movie]
  );

  const showMessage = (type, text) => {
    setMessageType(type);
    setMessage(text);
  };

  const verifyMockPayment = async (mockStatus) => {
    if (!pendingOrder) {
      showMessage("error", "Start checkout first to simulate a payment.");
      return;
    }

    if (mockStatus === "failed") {
      showMessage("error", "Mock payment failed. No purchase was saved.");
      setPendingOrder(null);
      return;
    }

    setIsSubmitting(true);

    try {
      const verifyResponse = await api.post("/payments/verify", {
        provider: "mock",
        razorpayOrderId: pendingOrder.order.id,
        razorpayPaymentId: `mock_payment_${Date.now()}`,
        razorpaySignature: "mock_signature",
        purchaseType: state,
        movie: moviePayload,
      });

      showMessage(
        "success",
        verifyResponse.data.message || "Mock payment completed successfully."
      );
      setPendingOrder(null);
      setTimeout(() => {
        setIsOpen(false);
      }, 1200);
    } catch (error) {
      showMessage(
        "error",
        error?.response?.data?.message || "Unable to verify mock payment."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const openRazorpayCheckout = async () => {
    if (!isAuthenticated) {
      showMessage("error", "Please sign in before continuing to checkout.");
      return;
    }

    if (!moviePayload.id) {
      showMessage("error", "Movie details are still loading. Please try again.");
      return;
    }

    setIsSubmitting(true);
    setMessage("");

    try {
      const orderResponse = await api.post("/payments/orders", {
        purchaseType: state,
        movie: moviePayload,
      });

      if (orderResponse.data.provider === "mock") {
        setPendingOrder(orderResponse.data);
        showMessage(
          "success",
          orderResponse.data.message ||
            "Mock checkout is ready. Simulate the payment result below."
        );
        setIsSubmitting(false);
        return;
      }

      if (!window.Razorpay) {
        showMessage("error", "Razorpay checkout is unavailable right now.");
        setIsSubmitting(false);
        return;
      }

      const options = {
        key: orderResponse.data.keyId,
        amount: orderResponse.data.order.amount,
        currency: orderResponse.data.order.currency,
        name: "Book My Show Clone",
        description: `${state} ${moviePayload.title}`,
        image:
          "https://i.ibb.co/zPBYW3H/imgbin-bookmyshow-office-android-ticket-png.png",
        order_id: orderResponse.data.order.id,
        prefill: {
          name: currentUser?.name || "",
          email: currentUser?.email || "",
        },
        theme: { color: "#c4242d" },
        modal: {
          ondismiss: () => {
            setIsSubmitting(false);
          },
        },
        handler: async (response) => {
          try {
            const verifyResponse = await api.post("/payments/verify", {
              provider: "razorpay",
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              purchaseType: state,
              movie: moviePayload,
            });

            showMessage(
              "success",
              verifyResponse.data.message || "Payment completed successfully."
            );
            setTimeout(() => {
              setIsOpen(false);
            }, 1200);
          } catch (error) {
            showMessage(
              "error",
              error?.response?.data?.message ||
                "Payment completed but verification failed."
            );
          } finally {
            setIsSubmitting(false);
          }
        },
      };

      const rzp = new window.Razorpay(options);

      rzp.on("payment.failed", (error) => {
        showMessage(
          "error",
          error?.error?.description || "Payment failed. Please try again."
        );
        setIsSubmitting(false);
      });

      rzp.open();
    } catch (error) {
      showMessage(
        "error",
        error?.response?.data?.message || "Unable to start checkout right now."
      );
      setIsSubmitting(false);
    }
  };

  const messageClassName =
    messageType === "success"
      ? "border-green-200 bg-green-50 text-green-700"
      : "border-red-200 bg-red-50 text-red-700";

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-90 max-w-md transform overflow-hidden rounded-2xl bg-white p-4 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  {state}
                </Dialog.Title>
                <div className="py-4">
                  <p className="pb-2 text-sm text-gray-800">
                    {state === "Rent"
                      ? "You can rent this movie for 30 days and you will have 2 days to finish it once playback starts."
                      : "Buy once and watch it any time from your account library."}
                  </p>
                  <hr />
                  <div className="flex justify-between py-3">
                    <h3>HD</h3>
                    <div className="flex items-center gap-1">
                      INR {price}
                      <FaCheckCircle className="text-green-500" />
                    </div>
                  </div>
                  <hr />
                  <div className="flex flex-col gap-2 pt-3 text-sm text-gray-800">
                    <p>
                      Streaming is supported on mobile, web, Android TV, Apple
                      TV, and Fire TV on compatible devices.
                    </p>
                    <p>
                      By continuing, you agree to complete the transaction using
                      the configured Razorpay checkout.
                    </p>
                    {currentUser ? (
                      <p className="text-xs text-gray-500">
                        Signed in as {currentUser.email}
                      </p>
                    ) : (
                      <p className="text-xs text-red-500">
                        Sign in first to save this purchase to your library.
                      </p>
                    )}
                    {pendingOrder ? (
                      <p className="text-xs text-blue-600">
                        Mock Razorpay checkout ready for {moviePayload.title}.
                      </p>
                    ) : null}
                  </div>
                  {message ? (
                    <div
                      className={`mt-4 rounded-lg border px-3 py-2 text-sm ${messageClassName}`}
                    >
                      {message}
                    </div>
                  ) : null}
                </div>

                <div className="mt-3 flex gap-4">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-green-500 px-4 py-2 text-sm font-medium text-white hover:bg-green-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
                    onClick={openRazorpayCheckout}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Processing..." : "Continue"}
                  </button>
                  {pendingOrder ? (
                    <>
                      <button
                        type="button"
                        className="inline-flex justify-center rounded-md border border-transparent bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600"
                        onClick={() => verifyMockPayment("success")}
                        disabled={isSubmitting}
                      >
                        Simulate Success
                      </button>
                      <button
                        type="button"
                        className="inline-flex justify-center rounded-md border border-transparent bg-yellow-500 px-4 py-2 text-sm font-medium text-white hover:bg-yellow-600"
                        onClick={() => verifyMockPayment("failed")}
                        disabled={isSubmitting}
                      >
                        Simulate Failure
                      </button>
                    </>
                  ) : null}
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                    onClick={closeModal}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
