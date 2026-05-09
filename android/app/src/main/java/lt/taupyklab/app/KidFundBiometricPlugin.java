package lt.taupyklab.app;

import androidx.biometric.BiometricManager;
import androidx.biometric.BiometricPrompt;
import androidx.core.content.ContextCompat;
import androidx.fragment.app.FragmentActivity;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import java.util.concurrent.Executor;

@CapacitorPlugin(name = "KidFundBiometric")
public class KidFundBiometricPlugin extends Plugin {

    private static final int AUTHENTICATORS =
        BiometricManager.Authenticators.BIOMETRIC_STRONG |
        BiometricManager.Authenticators.BIOMETRIC_WEAK;

    @PluginMethod
    public void isAvailable(PluginCall call) {
        BiometricManager manager = BiometricManager.from(getContext());
        int result = manager.canAuthenticate(AUTHENTICATORS);

        JSObject response = new JSObject();
        response.put("available", result == BiometricManager.BIOMETRIC_SUCCESS);
        response.put("code", result);
        response.put("reason", getReason(result));
        call.resolve(response);
    }

    @PluginMethod
    public void authenticate(PluginCall call) {
        FragmentActivity activity = getActivity();
        if (activity == null) {
            call.reject("No active activity");
            return;
        }

        BiometricManager manager = BiometricManager.from(getContext());
        int availability = manager.canAuthenticate(AUTHENTICATORS);
        if (availability != BiometricManager.BIOMETRIC_SUCCESS) {
            call.reject(getReason(availability));
            return;
        }

        Executor executor = ContextCompat.getMainExecutor(getContext());

        BiometricPrompt prompt = new BiometricPrompt(activity, executor, new BiometricPrompt.AuthenticationCallback() {
            @Override
            public void onAuthenticationSucceeded(BiometricPrompt.AuthenticationResult result) {
                JSObject response = new JSObject();
                response.put("success", true);
                call.resolve(response);
            }

            @Override
            public void onAuthenticationError(int errorCode, CharSequence errString) {
                call.reject(errString != null ? errString.toString() : "Authentication failed");
            }
        });

        String title = call.getString("title", "KidFund prisijungimas");
        String subtitle = call.getString("subtitle", "Patvirtinkite prisijungimą");
        String description = call.getString("description", "Patvirtinkite savo tapatybę biometriniu būdu");
        String cancelTitle = call.getString("cancelTitle", "Atšaukti");

        BiometricPrompt.PromptInfo promptInfo = new BiometricPrompt.PromptInfo.Builder()
            .setTitle(title)
            .setSubtitle(subtitle)
            .setDescription(description)
            .setConfirmationRequired(false)
            .setNegativeButtonText(cancelTitle)
            .build();

        activity.runOnUiThread(() -> prompt.authenticate(promptInfo));
    }

    private String getReason(int code) {
        switch (code) {
            case BiometricManager.BIOMETRIC_SUCCESS:
                return "Biometrija prieinama";
            case BiometricManager.BIOMETRIC_ERROR_NO_HARDWARE:
                return "Įrenginys nepalaiko biometrinio prisijungimo";
            case BiometricManager.BIOMETRIC_ERROR_HW_UNAVAILABLE:
                return "Biometrinė įranga šiuo metu neprieinama";
            case BiometricManager.BIOMETRIC_ERROR_NONE_ENROLLED:
                return "Įrenginyje neužregistruotas piršto atspaudas ar kita biometrika";
            case BiometricManager.BIOMETRIC_ERROR_SECURITY_UPDATE_REQUIRED:
                return "Reikalingas įrenginio saugumo atnaujinimas";
            case BiometricManager.BIOMETRIC_ERROR_UNSUPPORTED:
                return "Biometrinis prisijungimas nepalaikomas šiame įrenginyje";
            case BiometricManager.BIOMETRIC_STATUS_UNKNOWN:
            default:
                return "Biometrinio prisijungimo būsena nežinoma";
        }
    }
}
