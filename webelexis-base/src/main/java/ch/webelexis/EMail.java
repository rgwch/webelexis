package ch.webelexis;

import java.util.Date;
import java.util.Properties;

import javax.mail.Message;
import javax.mail.Message.RecipientType;
import javax.mail.MessagingException;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.AddressException;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;

public class EMail {
	String to;
	String from;
	String subject;
	String body;
	
	public EMail(String from, String to, String subject, String body){
		this.to=to;
		this.from=from;
		this.subject=subject;
		this.body=body;
	}
	
	public boolean send(String smtphost, String smtpuser, String smtppwd){
		try {
			Properties props=System.getProperties();
			props.put("mail.smpt.host", smtphost);
			Session session=Session.getInstance(props);
			Message msg=new MimeMessage(session);
			msg.setFrom(new InternetAddress(from));
			msg.setRecipient(RecipientType.TO, new InternetAddress(to));
			msg.setSubject(subject);
			msg.setText(body);
			msg.setSentDate(new Date());
			msg.setHeader("X-Mailer", "Webelexis");
			Transport.send(msg);
			return true;
		} catch (AddressException e) {
			CoreVerticle.log.error("illegal Address "+e.getMessage());
			e.printStackTrace();
		} catch (MessagingException e) {
			CoreVerticle.log.error("Send error "+e.getMessage());
			e.printStackTrace();
		}
		return false;
	}
	
}
