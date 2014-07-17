# Konsdecorator

A Utility to extract structure and embedded informations from plaintext

We use a definition of possible decorators to apply to any given text.
Decorators are identifiers for segments or values inside the text.

Example:
	{
		section: "subjectiv",
		label: "^s:\s"
	}
	{ 
		section: "objektiv",
		label: "^[oO]:"
	}
	
	{
		value: "blood pressure",
		pattern: "BD:\s?([0-9]{2,3}\/[0-9]{2,3})\s+"
	}
	{
		value: "body weight",
		pattern: "([0-9]{1,3}\.?[0-9]{0,2})\s*Kg"
	}
	