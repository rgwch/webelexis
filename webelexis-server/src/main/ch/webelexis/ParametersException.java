/**
 * Exception to throw if Webelexis got bad parameters
 */
package ch.webelexis;

public class ParametersException extends Exception {
    private static final long serialVersionUID = 2984974711577234030L;

    public ParametersException(String text) {
        super(text);
    }
}
