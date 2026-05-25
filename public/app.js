const output = document.getElementById("output");
const API_BASE = "/api/v1/users";

const show = (title, payload) => {
  output.textContent = `${title}\n\n${JSON.stringify(payload, null, 2)}`;
};

const readJson = async (response) => {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw data;
  }
  return data;
};

const callApi = async (path, options = {}) => {
  const response = await fetch(`${API_BASE}${path}`, {
    credentials: "include",
    ...options,
  });
  return readJson(response);
};

document.getElementById("registerForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.currentTarget;
  const formData = new FormData(form);

  const avatar = form.avatar.files[0];
  const coverImage = form.coverImage.files[0];
  if (!avatar) {
    formData.delete("avatar");
  }
  if (!coverImage) {
    formData.delete("coverImage");
  }

  try {
    const data = await callApi("/register", {
      method: "POST",
      body: formData,
    });
    show("Register success", data);
    form.reset();
  } catch (error) {
    show("Register failed", error);
  }
});

document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.currentTarget;
  const identity = form.identity.value.trim();

  const payload = {
    password: form.password.value,
  };
  if (identity.includes("@")) {
    payload.email = identity;
  } else {
    payload.username = identity;
  }

  try {
    const data = await callApi("/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    show("Login success", data);
    form.reset();
  } catch (error) {
    show("Login failed", error);
  }
});

document.getElementById("updateAccountForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.currentTarget;
  try {
    const data = await callApi("/update-account", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName: form.fullName.value,
        email: form.email.value,
      }),
    });
    show("Update account success", data);
    form.reset();
  } catch (error) {
    show("Update account failed", error);
  }
});

document.getElementById("changePasswordForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.currentTarget;
  try {
    const data = await callApi("/change-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        oldPassword: form.oldPassword.value,
        newPassword: form.newPassword.value,
      }),
    });
    show("Change password success", data);
    form.reset();
  } catch (error) {
    show("Change password failed", error);
  }
});

document.getElementById("currentUserBtn").addEventListener("click", async () => {
  try {
    const data = await callApi("/current-user");
    show("Current user", data);
  } catch (error) {
    show("Get current user failed", error);
  }
});

document.getElementById("refreshBtn").addEventListener("click", async () => {
  try {
    const data = await callApi("/refresh-token", { method: "POST" });
    show("Refresh token success", data);
  } catch (error) {
    show("Refresh token failed", error);
  }
});

document.getElementById("logoutBtn").addEventListener("click", async () => {
  try {
    const data = await callApi("/logout", { method: "POST" });
    show("Logout success", data);
  } catch (error) {
    show("Logout failed", error);
  }
});
