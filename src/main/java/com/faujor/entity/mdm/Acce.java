package com.faujor.entity.mdm;

import java.io.Serializable;

public class Acce implements Serializable{

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	private String id;
	private String name;
	public Acce() {
		super();
		// TODO Auto-generated constructor stub
	}
	public Acce(String id, String name) {
		super();
		this.id = id;
		this.name = name;
	}
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public static long getSerialversionuid() {
		return serialVersionUID;
	}
	@Override
	public String toString() {
		return "Acce [id=" + id + ", name=" + name + "]";
	}
	
	
}
