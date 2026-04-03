import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useContext, useEffect, useState } from "react";
import { userContext } from "../../Context/UserContext";
import BookMyShowLogo from "../../assets/bookmyshow.svg";
import api from "../../lib/api";

const emptyForm = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const formatDate = (value) => {
  if (!value) {
    return "";
  }

  return new Date(value).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export default function UserModal({ isOpen, setIsOpen }) {
  const { currentUser, isAuthenticated, signIn, signUp, logout } =
    useContext(userContext);
  const [mode, setMode] = useState("signin");
  const [formData, setFormData] = useState(emptyForm);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("error");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [purchases, setPurchases] = useState([]);
  const [isPurchasesLoading, setIsPurchasesLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setFormData(emptyForm);
    setMessage("");
    setMessageType("error");
    setIsSubmitting(false);
    setMode(isAuthenticated ? "account" : "signin");
  }, [isAuthenticated, isOpen]);

  useEffect(() => {
    if (!isOpen || !isAuthenticated || mode !== "account") {
      return;
    }

    let ignore = false;

    const loadPurchases = async () => {
      setIsPurchasesLoading(true);

      try {
        const response = await api.get("/payments/history");

        if (!ignore) {
          setPurchases(response.data.purchases || []);
        }
      } catch (error) {
        if (!ignore) {
          setPurchases([]);
        }
      } finally {
        if (!ignore) {
          setIsPurchasesLoading(false);
        }
      }
    };

    loadPurchases();

    return () => {
      ignore = true;
    };
  }, [isAuthenticated, isOpen, mode]);

  const closeModal = () => {
    if (!isSubmitting) {
      setIsOpen(false);
    }
  };

  const updateField = (event) => {
    const { name, value } = event.target;

    setFormData((previousFormData) => ({
      ...previousFormData,
      [name]: value,
    }));
  };

  const switchMode = (nextMode) => {
    setMode(nextMode);
    setFormData(emptyForm);
    setMessage("");
    setMessageType("error");
    setIsSubmitting(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setIsSubmitting(true);
    const result = await (mode === "signup" ? signUp(formData) : signIn(formData));

    setMessage(result.message);
    setMessageType(result.success ? "success" : "error");
    setIsSubmitting(false);

    if (result.success) {
      setTimeout(() => {
        setIsOpen(false);
      }, 500);
    }
  };

  const handleLogout = async () => {
    setIsSubmitting(true);
    await logout();
    setPurchases([]);
    setMessage("");
    setIsSubmitting(false);
    setIsOpen(false);
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
              <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="mx-auto mb-4 flex h-10 w-36 justify-center">
                  <img
                    src={BookMyShowLogo}
                    alt="Book My Show"
                    className="h-full w-full"
                  />
                </div>

                {isAuthenticated && mode === "account" ? (
                  <div className="space-y-4">
                    <Dialog.Title
                      as="h3"
                      className="text-xl font-semibold text-gray-900"
                    >
                      Welcome back, {currentUser.name}
                    </Dialog.Title>
                    <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                      <p className="text-sm text-gray-500">Signed in as</p>
                      <p className="text-base font-medium text-gray-900">
                        {currentUser.email}
                      </p>
                    </div>
                    <div>
                      <div className="mb-2 flex items-center justify-between">
                        <h4 className="text-base font-semibold text-gray-900">
                          Your Library
                        </h4>
                        <span className="text-sm text-gray-500">
                          {purchases.length} purchase{purchases.length === 1 ? "" : "s"}
                        </span>
                      </div>
                      <div className="max-h-64 space-y-3 overflow-y-auto rounded-xl border border-gray-200 bg-gray-50 p-3">
                        {isPurchasesLoading ? (
                          <p className="text-sm text-gray-500">
                            Loading purchase history...
                          </p>
                        ) : purchases.length === 0 ? (
                          <p className="text-sm text-gray-500">
                            No purchases yet. Rent or buy a movie to see it here.
                          </p>
                        ) : (
                          purchases.map((purchase) => (
                            <div
                              key={purchase._id}
                              className="rounded-lg border border-gray-200 bg-white p-3"
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div>
                                  <p className="font-medium text-gray-900">
                                    {purchase.title}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    {purchase.purchaseType} on{" "}
                                    {formatDate(purchase.purchasedAt)}
                                  </p>
                                  {purchase.expiresAt ? (
                                    <p className="text-sm text-gray-500">
                                      Access until {formatDate(purchase.expiresAt)}
                                    </p>
                                  ) : null}
                                </div>
                                <span className="rounded-full bg-red-50 px-2 py-1 text-xs font-semibold text-red-600">
                                  INR {purchase.amount}
                                </span>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button
                        type="button"
                        className="inline-flex justify-center rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                        onClick={handleLogout}
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Logging out..." : "Logout"}
                      </button>
                      <button
                        type="button"
                        className="inline-flex justify-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                        onClick={closeModal}
                      >
                        Close
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <Dialog.Title
                      as="h3"
                      className="text-xl font-semibold text-gray-900"
                    >
                      {mode === "signup"
                        ? "Create your account"
                        : "Sign in to BookMyShow"}
                    </Dialog.Title>
                    <p className="mt-2 text-sm text-gray-600">
                      {mode === "signup"
                        ? "Create your account and store users in MongoDB through the auth API."
                        : "Sign in with your MongoDB-backed account to continue."}
                    </p>

                    <div className="mt-5 flex rounded-lg bg-gray-100 p-1">
                      <button
                        type="button"
                        className={`w-1/2 rounded-md px-4 py-2 text-sm font-medium ${
                          mode === "signin"
                            ? "bg-white text-red-600 shadow-sm"
                            : "text-gray-600"
                        }`}
                        onClick={() => switchMode("signin")}
                      >
                        Sign in
                      </button>
                      <button
                        type="button"
                        className={`w-1/2 rounded-md px-4 py-2 text-sm font-medium ${
                          mode === "signup"
                            ? "bg-white text-red-600 shadow-sm"
                            : "text-gray-600"
                        }`}
                        onClick={() => switchMode("signup")}
                      >
                        Sign up
                      </button>
                    </div>

                    {message ? (
                      <div
                        className={`mt-4 rounded-lg border px-3 py-2 text-sm ${messageClassName}`}
                      >
                        {message}
                      </div>
                    ) : null}

                    <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
                      {mode === "signup" ? (
                        <div>
                          <label
                            className="mb-1 block text-sm font-medium text-gray-700"
                            htmlFor="name"
                          >
                            Full name
                          </label>
                          <input
                            id="name"
                            name="name"
                            type="text"
                            value={formData.name}
                            onChange={updateField}
                            autoFocus
                            placeholder="Enter your full name"
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-red-500"
                          />
                        </div>
                      ) : null}

                      <div>
                        <label
                          className="mb-1 block text-sm font-medium text-gray-700"
                          htmlFor="email"
                        >
                          Email address
                        </label>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={updateField}
                          autoFocus={mode === "signin"}
                          placeholder="Enter your email"
                          className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-red-500"
                        />
                      </div>

                      <div>
                        <label
                          className="mb-1 block text-sm font-medium text-gray-700"
                          htmlFor="password"
                        >
                          Password
                        </label>
                        <input
                          id="password"
                          name="password"
                          type="password"
                          value={formData.password}
                          onChange={updateField}
                          placeholder="Enter your password"
                          className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-red-500"
                        />
                      </div>

                      {mode === "signup" ? (
                        <div>
                          <label
                            className="mb-1 block text-sm font-medium text-gray-700"
                            htmlFor="confirmPassword"
                          >
                            Confirm password
                          </label>
                          <input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            value={formData.confirmPassword}
                            onChange={updateField}
                            placeholder="Re-enter your password"
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-red-500"
                          />
                        </div>
                      ) : null}

                      <div className="flex gap-3 pt-2">
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="inline-flex justify-center rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                        >
                          {isSubmitting
                            ? mode === "signup"
                              ? "Creating..."
                              : "Signing in..."
                            : mode === "signup"
                            ? "Create account"
                            : "Sign in"}
                        </button>
                        <button
                          type="button"
                          className="inline-flex justify-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                          onClick={closeModal}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
